import React, { createContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useExpansion, useKeyBoard } from './hooks';
import ToolBar from './layouts/Toolbar';
import Content from './layouts/Content';
import Catalog from './layouts/Catalog';
import bus from './utils/event-bus';

import {
  prefix,
  allToolbar,
  highlightUrl,
  iconfontUrl,
  prettierUrl,
  cropperUrl,
  staticTextDefault,
  screenfullUrl,
  mermaidUrl,
  katexJsUrl,
  katexCssUrl
} from './config';

import { ContentType, MarkedHeadingId, EditorProp, SettingType } from './type';
import DropdownToolbar from './DropdownToolbar';
import NormalToolbar from './NormalToolbar';

import './styles/index.less';
import '@vavt/markdown-theme/css/all.css';

export const EditorContext = createContext<ContentType>({
  editorId: '',
  tabWidth: 2,
  historyLength: 10,
  previewOnly: false,
  showCodeRowNumber: false,
  usedLanguageText: staticTextDefault['zh-CN'],
  Cropper: null,
  theme: 'light',
  previewTheme: 'default'
});

// 初始为空，渲染到页面后获取页面属性
let bodyOverflowHistory = '';

const markedHeadingId: MarkedHeadingId = (text) => text;

const Editor = (props: EditorProp) => {
  const {
    theme,
    editorClass,
    toolbars,
    toolbarsExclude,
    preview,
    htmlPreview,
    previewOnly,
    pageFullScreen,
    editorId,
    tabWidth,
    screenfull,
    screenfullJs
  } = props;

  const [state, setState] = useState({
    catalogVisible: false
  });

  useKeyBoard(props);

  useExpansion(props);

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

  const uploadImageCallBack = (files: FileList, cb: () => void) => {
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
  const highlightSet = useMemo(() => {
    let url = highlightUrl.atom;

    if (props.highlightCss) {
      // 用户设置为高优先级
      url = props.highlightCss;
    } else {
      // 低优先级，根据全局主题加预览主题判断使用
      switch (props.previewTheme) {
        case 'github': {
          if (props.theme === 'dark') {
            url = highlightUrl.githubDark;
          } else {
            url = highlightUrl.github;
          }

          break;
        }
      }
    }

    return {
      js: props.highlightJs,
      css: url
    };
  }, [props.highlightCss, props.previewTheme, props.theme]);

  // 缓存语言设置
  const usedLanguageText = useMemo(() => {
    const allText: any = {
      ...staticTextDefault,
      ...props.languageUserDefined
    };

    if (allText[props.language]) {
      return allText[props.language];
    } else {
      return staticTextDefault['zh-CN'];
    }
  }, [props.languageUserDefined, props.language]);

  // 是否挂载目录组件
  const catalogShow = useMemo(() => {
    return !toolbarsExclude.includes('catalog') && toolbars.includes('catalog');
  }, [toolbars, toolbarsExclude]);

  return (
    <EditorContext.Provider
      value={{
        editorId,
        tabWidth,
        theme: props.theme,
        historyLength: props.historyLength,
        previewOnly,
        showCodeRowNumber: props.showCodeRowNumber,
        usedLanguageText,
        Cropper: props.Cropper,
        previewTheme: props.previewTheme
      }}
    >
      <div
        id={editorId}
        className={cn([
          prefix,
          editorClass,
          theme === 'dark' && `${prefix}-dark`,
          setting.fullscreen || setting.pageFullScreen ? `${prefix}-fullscreen` : '',
          previewOnly && `${prefix}-previewOnly`
        ])}
        style={props.style}
      >
        {!previewOnly && (
          <ToolBar
            prettier={props.prettier}
            screenfull={screenfull}
            screenfullJs={screenfullJs}
            toolbars={toolbars}
            toolbarsExclude={toolbarsExclude}
            setting={setting}
            updateSetting={updateSetting}
            tableShape={props.tableShape}
            defToolbars={props.defToolbars}
          />
        )}
        <Content
          hljs={props.hljs}
          highlightSet={highlightSet}
          mermaid={props.mermaid}
          mermaidJs={props.mermaidJs}
          noMermaid={props.noMermaid}
          value={props.modelValue}
          onChange={props.onChange}
          setting={setting}
          onHtmlChanged={props.onHtmlChanged}
          onGetCatalog={props.onGetCatalog}
          markedHeading={props.markedHeading}
          sanitize={props.sanitize}
          placeholder={props.placeholder}
          katex={props.katex}
          katexJs={props.katexJs}
          katexCss={props.katexCss}
          noKatex={props.noKatex}
          extensions={props.extensions}
        />
        {catalogShow && (
          <Catalog
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
  editorClass: '',
  highlightJs: highlightUrl.js,
  highlightCss: '',
  historyLength: 10,
  onChange() {},
  pageFullScreen: false,
  preview: true,
  htmlPreview: false,
  previewOnly: false,
  language: 'zh-CN',
  languageUserDefined: {},
  toolbars: allToolbar,
  toolbarsExclude: [],
  prettier: true,
  prettierCDN: prettierUrl.main,
  prettierMDCDN: prettierUrl.markdown,
  cropperCss: cropperUrl.css,
  cropperJs: cropperUrl.js,
  iconfontJs: iconfontUrl,
  editorId: `md-editor-rt`,
  tabWidth: 2,
  showCodeRowNumber: false,
  screenfullJs: screenfullUrl,
  previewTheme: 'default',
  markedHeading: (text, level, raw) => {
    // 我们默认同一级别的标题，你不会定义两个相同的
    const id = markedHeadingId(raw, level);

    // 如果标题有markdown语法内容，会按照该语法添加标题，而不再自定义，但是仍然支持目录定位
    if (text !== raw) {
      return `<h${level} id="${id}">${text}</h${level}>`;
    } else {
      return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
    }
  },
  // 希望你在自定义markedHeading的同时，能够告诉编辑器你生成ID的算法~
  markedHeadingId: markedHeadingId,
  style: {},
  tableShape: [6, 4],
  mermaidJs: mermaidUrl,
  sanitize: (html) => html,
  placeholder: '',
  katexJs: katexJsUrl,
  katexCss: katexCssUrl
} as EditorProp;

Editor.DropdownToolbar = DropdownToolbar;
Editor.NormalToolbar = NormalToolbar;
Editor.Catalog = Catalog;

export * from './type';

export default Editor;
