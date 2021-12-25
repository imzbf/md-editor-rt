import React, { createContext, CSSProperties, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useExpansion, useKeyBoard } from './hooks';
import ToolBar from './layouts/Toolbar';
import Content from './layouts/Content';
import Catalog from './layouts/Catalog';
import bus from './utils/event-bus';

import {
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

import { prefix } from './config';

import './styles/index.less';

import '@vavt/markdown-theme/css/all.css';

declare global {
  interface Window {
    hljs: any;
    prettier: any;
    prettierPlugins: any;
    Cropper: any;
    screenfull: any;
    mermaid: any;
    katex: any;
  }
}

export interface ToolbarTips {
  bold?: string;
  underline?: string;
  italic?: string;
  strikeThrough?: string;
  title?: string;
  sub?: string;
  sup?: string;
  quote?: string;
  unorderedList?: string;
  orderedList?: string;
  codeRow?: string;
  code?: string;
  link?: string;
  image?: string;
  table?: string;
  mermaid?: string;
  katex?: string;
  revoke?: string;
  next?: string;
  save?: string;
  prettier?: string;
  pageFullscreen?: string;
  fullscreen?: string;
  catalog?: string;
  preview?: string;
  htmlPreview?: string;
  github?: string;
  '-'?: string;
  '='?: string;
}

export interface StaticTextDefaultValue {
  toolbarTips?: ToolbarTips;
  titleItem?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  imgTitleItem?: {
    link: string;
    upload: string;
    clip2upload: string;
  };
  linkModalTips?: {
    title?: string;
    descLable?: string;
    descLablePlaceHolder?: string;
    urlLable?: string;
    UrlLablePlaceHolder?: string;
    buttonOK?: string;
  };
  clipModalTips?: {
    title?: string;
    buttonUpload?: string;
  };
  copyCode?: {
    text?: string;
    tips?: string;
  };
  mermaid?: {
    // 流程图
    flow?: string;
    // 时序图
    sequence?: string;
    // 甘特图
    gantt?: string;
    // 类图
    class?: string;
    // 状态图
    state?: string;
    // 饼图
    pie?: string;
    // 关系图
    relationship?: string;
    // 旅程图
    journey?: string;
  };
  katex?: {
    inline: string;
    block: string;
  };
}

export interface StaticTextDefault {
  'zh-CN': StaticTextDefaultValue;
  'en-US': StaticTextDefaultValue;
}

export type StaticTextDefaultKey = keyof StaticTextDefault;

export type ToolbarNames = keyof ToolbarTips;

export interface SettingType {
  pageFullScreen: boolean;
  fullscreen: boolean;
  preview: boolean;
  htmlPreview: boolean;
}

export interface HeadList {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export type PreviewThemes = 'default' | 'github' | 'vuepress';

// marked heading方法
export type MarkedHeading = (
  text: string,
  level: 1 | 2 | 3 | 4 | 5 | 6,
  raw: string,
  // marked@2.1.3
  slugger: {
    seen: { [slugValue: string]: number };
    slug(
      value: string,
      options?: {
        dryrun: boolean;
      }
    ): string;
  }
) => string;

export type MarkedHeadingId = (text: string, level: number) => string;

export interface EditorProp {
  modelValue: string;
  // 主题，默认light
  theme: 'light' | 'dark';
  // 外层扩展类名
  editorClass: string;
  // 如果项目中有使用highlight.js或者没有外网访问权限，可以直接传递实例hljs并且手动导入css
  hljs?: any;
  // 可以手动提供highlight.js的cdn链接
  highlightJs: string;
  highlightCss: string;
  // 历史记录最长条数，默认10
  historyLength: number;
  // input回调事件
  onChange: (v: string) => void;
  // 保存事件
  onSave?: (v: string) => void;
  // 上传图片事件
  onUploadImg?: (files: FileList, callBack: (urls: string[]) => void) => void;
  // 是否页面内全屏，默认false
  pageFullScreen: boolean;
  // 是否展开预览，默认true
  preview: boolean;
  // 是否展开html预览，默认false
  htmlPreview: boolean;
  // 仅预览模式，不显示toolbar和编辑框，默认false
  previewOnly: boolean;
  // 预设语言名称
  language: StaticTextDefaultKey | string;
  // 语言扩展，以标准的形式定义内容，设置language为key值即可替换
  languageUserDefined?: { [key: string]: StaticTextDefaultValue };
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
  // 格式化md，默认true
  prettier: boolean;
  prettierCDN: string;
  prettierMDCDN: string;
  // html变化事件
  onHtmlChanged?: (h: string) => void;
  // 图片裁剪对象
  Cropper?: any;
  // 图片裁剪
  cropperCss: string;
  cropperJs: string;
  // 图标
  iconfontJs: string;
  // 获取目录结构
  onGetCatalog?: (list: HeadList[]) => void;
  // 编辑器唯一标识
  editorId: string;
  tabWidth: number;
  // 预览中代码是否显示行号
  showCodeRowNumber: boolean;
  screenfull?: any;
  screenfullJs: string;
  // 预览内容样式
  previewTheme: PreviewThemes;
  markedHeading: MarkedHeading;
  markedHeadingId: MarkedHeadingId;
  // 编辑器样式
  style: CSSProperties;
  // 表格预设格子数
  tableShape: [number, number];
  // mermaid实例
  mermaid?: any;
  // mermaid script链接
  mermaidJs: string;
  // 不使用该功能
  noMermaid?: boolean;
  // 不能保证文本正确的情况，在marked编译md文本后通过该方法处理
  // 推荐DOMPurify、sanitize-html
  sanitize: (html: string) => string;
  placeholder: string;
  // katex实例
  katex?: any;
  // katex script链接
  katexJs: string;
  katexCss: string;
  noKatex?: boolean;
}

export interface ContentType {
  editorId: string;
  tabWidth: number;
  historyLength: number;
  previewOnly: boolean;
  showCodeRowNumber: boolean;
  usedLanguageText: StaticTextDefaultValue;
  Cropper: any;
  theme: 'light' | 'dark';
  previewTheme: PreviewThemes;
}

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
      urls.forEach((url) => {
        // 利用事件循环机制，保证两次插入分开进行
        setTimeout(() => {
          bus.emit(editorId, 'replace', 'image', {
            desc: '',
            url
          });
        }, 0);
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
        />
        {catalogShow && <Catalog markedHeadingId={props.markedHeadingId} />}
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

export default Editor;
