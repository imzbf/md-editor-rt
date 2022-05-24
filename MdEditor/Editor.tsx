import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useExpansion, useKeyBoard } from './hooks';
import ToolBar from './layouts/Toolbar';
import Content from './layouts/Content';
import bus from './utils/event-bus';
import configFn from './utils/config';

import { prefix, allToolbar, highlightUrl, staticTextDefault, codeCss } from './config';

import {
  ContentType,
  MarkedHeadingId,
  EditorProp,
  SettingType,
  ConfigOption,
  InnerError
} from './type';
import DropdownToolbar from './extensions/DropdownToolbar';
import NormalToolbar from './extensions/NormalToolbar';
import ModalToolbar from './extensions/ModalToolbar';
import MdCatalog from './extensions/MdCatalog';

import './styles/index.less';
import '@vavt/markdown-theme/css/all.css';

export const EditorContext = createContext<ContentType>({
  editorId: '',
  tabWidth: 2,
  theme: 'light',
  highlight: {
    css: '',
    js: ''
  },
  historyLength: 10,
  previewOnly: false,
  showCodeRowNumber: false,
  usedLanguageText: staticTextDefault['zh-CN'],
  previewTheme: 'default',
  extension: {}
});

// 初始为空，渲染到页面后获取页面属性
let bodyOverflowHistory = '';

const markedHeadingId: MarkedHeadingId = (text) => text;

const Editor = (props: EditorProp) => {
  const {
    theme,
    className,
    toolbars,
    toolbarsExclude,
    preview,
    htmlPreview,
    previewOnly,
    pageFullScreen,
    editorId,
    tabWidth,
    historyLength,
    showCodeRowNumber,
    previewTheme
    // screenfull,
    // screenfullJs
  } = props;

  const [state, setState] = useState<{
    catalogVisible: boolean;
    extension: ConfigOption;
  }>(() => {
    return {
      catalogVisible: false,
      extension: Editor.extension
    };
  });

  const highlight = useMemo(() => {
    const highlightConfig = state.extension?.editorExtensions?.highlight;

    const cssList = {
      ...codeCss,
      ...highlightConfig?.css
    };

    return {
      js: highlightConfig?.js || highlightUrl,
      css: cssList[props.codeTheme]
        ? cssList[props.codeTheme][props.theme as 'light' | 'dark']
        : codeCss.atom[props.theme as 'light' | 'dark']
    };
  }, [props.theme, props.codeTheme]);

  useKeyBoard(props);

  useExpansion(props, state.extension);

  // ----编辑器设置----
  const [setting, setSetting] = useState<SettingType>({
    pageFullScreen: pageFullScreen,
    fullscreen: false,
    preview: preview,
    htmlPreview: preview ? false : htmlPreview
  });

  const updateSetting = (k: keyof typeof setting) => {
    setSetting((settingN) => {
      const nextSetting = {
        ...settingN,
        [k]: !settingN[k]
      } as SettingType;

      if (k === 'preview' && nextSetting.preview) {
        nextSetting.htmlPreview = false;
      } else if (k === 'htmlPreview' && nextSetting.htmlPreview) {
        nextSetting.preview = false;
      }

      return nextSetting;
    });
  };

  const uploadImageCallBack = (files: Array<File>, cb: () => void) => {
    const insertHanlder = (urls: Array<string>) => {
      bus.emit(editorId, 'replace', 'image', {
        desc: '',
        urls
      });

      cb && cb();
    };

    if (props.onUploadImg) {
      props.onUploadImg(files, insertHanlder);
    }
  };

  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, 'uploadImage', uploadImageCallBack);
      // 监听上传图片
      bus.on(editorId, {
        name: 'uploadImage',
        callback: uploadImageCallBack
      });

      // 保存body部分样式
      bodyOverflowHistory = document.body.style.overflow;
    }

    bus.on(editorId, {
      name: 'catalogShow',
      callback: () => {
        setState((_state) => {
          return {
            ..._state,
            catalogVisible: !_state.catalogVisible
          };
        });
      }
    });

    return () => {
      // 清空所有的事件监听
      bus.clear(editorId);
    };
  }, []);

  // 变化是调整一次
  useEffect(() => {
    if (setting.pageFullScreen || setting.fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = bodyOverflowHistory;
    }
  }, [setting.pageFullScreen, setting.fullscreen]);
  // ----end----

  // 缓存代码扩展
  // const highlightSet = useMemo(() => {
  //   let url = highlightUrl.atom;

  //   if (props.highlightCss) {
  //     // 用户设置为高优先级
  //     url = props.highlightCss;
  //   } else {
  //     // 低优先级，根据全局主题加预览主题判断使用
  //     switch (props.previewTheme) {
  //       case 'github': {
  //         if (props.theme === 'dark') {
  //           url = highlightUrl.githubDark;
  //         } else {
  //           url = highlightUrl.github;
  //         }

  //         break;
  //       }
  //     }
  //   }

  //   return {
  //     js: props.highlightJs,
  //     css: url
  //   };
  // }, [props.highlightCss, props.previewTheme, props.theme]);

  // 缓存语言设置
  const usedLanguageText = useMemo(() => {
    const allText: any = {
      ...staticTextDefault,
      ...state.extension?.editorConfig?.languageUserDefined
    };

    if (allText[props.language]) {
      return allText[props.language];
    } else {
      return staticTextDefault['zh-CN'];
    }
  }, [props.language]);

  // 是否挂载目录组件
  const catalogShow = useMemo(() => {
    return !toolbarsExclude.includes('catalog') && toolbars.includes('catalog');
  }, [toolbars, toolbarsExclude]);

  useEffect(() => {
    bus.on(editorId, {
      name: 'errorCatcher',
      callback: (err: InnerError) => {
        if (props.onError instanceof Function) {
          props.onError(err);
        }
      }
    });
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editorId,
        tabWidth,
        theme,
        highlight,
        historyLength,
        previewOnly,
        showCodeRowNumber,
        usedLanguageText,
        previewTheme,
        extension: Editor.extension
      }}
    >
      <div
        id={editorId}
        className={[
          prefix,
          className,
          theme === 'dark' && `${prefix}-dark`,
          setting.fullscreen || setting.pageFullScreen ? `${prefix}-fullscreen` : '',
          previewOnly && `${prefix}-previewOnly`
        ]
          .filter((c) => !!c)
          .join(' ')}
        style={props.style}
      >
        {!previewOnly && (
          <ToolBar
            noPrettier={props.noPrettier}
            // screenfull={screenfull}
            // screenfullJs={screenfullJs}
            toolbars={toolbars}
            toolbarsExclude={toolbarsExclude}
            setting={setting}
            updateSetting={updateSetting}
            tableShape={props.tableShape}
            defToolbars={props.defToolbars}
          />
        )}
        <Content
          // hljs={props.hljs}
          // highlightSet={highlightSet}
          // mermaid={props.mermaid}
          // mermaidJs={props.mermaidJs}
          value={props.modelValue}
          onChange={props.onChange}
          setting={setting}
          onHtmlChanged={props.onHtmlChanged}
          onGetCatalog={props.onGetCatalog}
          // markedHeading={props.markedHeading}
          sanitize={props.sanitize}
          noMermaid={props.noMermaid}
          placeholder={props.placeholder}
          // katex={props.katex}
          // katexJs={props.katexJs}
          // katexCss={props.katexCss}
          noKatex={props.noKatex}
          // extensions={props.extensions}
          // markedImage={props.markedImage}
          mermaidTemplate={state.extension?.editorConfig?.mermaidTemplate}
          markedHeadingId={props.markedHeadingId}
        />
        {catalogShow && (
          <MdCatalog
            theme={props.theme}
            style={{
              display: state.catalogVisible ? 'block' : 'none'
            }}
            className={`${prefix}-catalog-editor`}
            editorId={editorId}
            markedHeadingId={props.markedHeadingId}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
};

Editor.defaultProps = {
  modelValue: '',
  theme: 'light',
  className: '',
  // highlightJs: highlightUrl.js,
  // highlightCss: '',
  historyLength: 10,
  onChange() {},
  pageFullScreen: false,
  preview: true,
  htmlPreview: false,
  previewOnly: false,
  language: 'zh-CN',
  // languageUserDefined: {},
  toolbars: allToolbar,
  toolbarsExclude: [],
  noPrettier: false,
  // prettierCDN: prettierUrl.main,
  // prettierMDCDN: prettierUrl.markdown,
  // cropperCss: cropperUrl.css,
  // cropperJs: cropperUrl.js,
  // iconfontJs: iconfontUrl,
  editorId: `md-editor-rt`,
  tabWidth: 2,
  showCodeRowNumber: false,
  // screenfullJs: screenfullUrl,
  previewTheme: 'default',
  // markedHeading: (text, level, raw) => {
  //   // 我们默认同一级别的标题，你不会定义两个相同的
  //   const id = markedHeadingId(raw, level);

  //   // 如果标题有markdown语法内容，会按照该语法添加标题，而不再自定义，但是仍然支持目录定位
  //   if (text !== raw) {
  //     return `<h${level} id="${id}">${text}</h${level}>`;
  //   } else {
  //     return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
  //   }
  // },
  // 希望你在自定义markedHeading的同时，能够告诉编辑器你生成ID的算法~
  markedHeadingId,
  style: {},
  tableShape: [6, 4],
  // mermaidJs: mermaidUrl,
  sanitize: (html: string) => html,
  placeholder: '',
  // katexJs: katexJsUrl,
  // katexCss: katexCssUrl,
  // markedImage: (href: string, _: string, desc: string) => {
  //   return `<figure><img src="${href}" alt="${desc}"><figcaption>${desc}</figcaption></figure>`;
  // }
  codeTheme: 'atom'
} as EditorProp;

Editor.DropdownToolbar = DropdownToolbar;
Editor.NormalToolbar = NormalToolbar;
Editor.MdCatalog = MdCatalog;
Editor.ModalToolbar = ModalToolbar;
Editor.config = configFn;
Editor.extension = {};

export * from './type';

export default Editor;
