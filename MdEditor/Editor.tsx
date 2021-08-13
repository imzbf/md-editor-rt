import React, { createContext, useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import { useKeyBoard } from './hooks';
import ToolBar from './layouts/Toolbar';
import Content from './layouts/Content';
import bus from './utils/event-bus';

import {
  allToolbar,
  highlightUrl,
  iconfontUrl,
  prettierUrl,
  cropperUrl,
  staticTextDefault
} from './config';

import { prefix } from './config';

import './styles/index.less';

declare global {
  interface Window {
    hljs: any;
    prettier: any;
    prettierPlugins: any;
    Cropper: any;
  }
}

export interface SettingType {
  pageFullScreen: boolean;
  fullscreen: boolean;
  preview: boolean;
  htmlPreview: boolean;
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
  revoke?: string;
  next?: string;
  save?: string;
  prettier?: string;
  pageFullscreen?: string;
  fullscreen?: string;
  preview?: string;
  htmlPreview?: string;
  github?: string;
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
  linkModalTips?: {
    title?: string;
    descLable?: string;
    descLablePlaceHolder?: string;
    urlLable?: string;
    UrlLablePlaceHolder?: string;
    buttonOK?: string;
    buttonUpload?: string;
    buttonUploadClip?: string;
  };
  clipModalTips?: {
    title?: string;
    buttonUpload?: string;
  };
  copyCode?: {
    text?: string;
    tips?: string;
  };
}

export interface StaticTextDefault {
  'zh-CN': StaticTextDefaultValue;
  'en-US': StaticTextDefaultValue;
}

export type StaticTextDefaultKey = keyof StaticTextDefault;

export type ToolbarNames = keyof ToolbarTips;

export interface HeadList {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface EditorProp {
  modelValue: string;
  // 主题，默认light
  theme?: 'light' | 'dark';
  // 外层扩展类名
  editorClass?: string;
  // 如果项目中有使用highlight.js或者没有外网访问权限，可以直接传递实例hljs并且手动导入css
  hljs?: Record<string, unknown>;
  // 可以手动提供highlight.js的cdn链接
  highlightJs?: string;
  highlightCss?: string;
  // 历史记录最长条数，默认10
  historyLength?: number;
  // input回调事件
  onChange?: (v: string) => void;
  // 保存事件
  onSave?: (v: string) => void;
  // 上传图片事件
  onUploadImg?: (files: FileList, callBack: (urls: string[]) => void) => void;
  // 是否页面内全屏，默认false
  pageFullScreen?: boolean;
  // 是否展开预览，默认true
  preview?: boolean;
  // 是否展开html预览，默认false
  htmlPreview?: boolean;
  // 仅预览模式，不显示toolbar和编辑框，默认false
  previewOnly?: boolean;
  // 预设语言名称
  language?: StaticTextDefaultKey | string;
  // 语言扩展，以标准的形式定义内容，设置language为key值即可替换
  languageUserDefined?: Array<{ [key: string]: StaticTextDefaultValue }>;
  // 工具栏选择显示
  toolbars?: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude?: Array<ToolbarNames> | [];
  // 格式化md，默认true
  prettier?: boolean;
  prettierCDN?: string;
  prettierMDCDN?: string;
  // html变化事件
  onHtmlChanged?: (h: string) => void;
  // 图片裁剪
  cropperCss?: string;
  cropperJs?: string;
  // 图标
  iconfontJs?: string;
  // 编辑器唯一标识
  editorId?: string;
  // 获取目录结构
  onGetCatalog?: (list: HeadList[]) => void;
}

export const EditorContext = createContext({
  editorId: ''
});

const Editor = (props: EditorProp) => {
  const {
    theme = 'light',
    editorClass = '',
    toolbars = allToolbar,
    toolbarsExclude = [],
    preview = true,
    htmlPreview = false,
    iconfontJs = iconfontUrl,
    prettier = true,
    prettierCDN = prettierUrl.main,
    prettierMDCDN = prettierUrl.markdown,
    previewOnly,
    pageFullScreen = false,
    language = 'zh-CN',
    languageUserDefined = [],
    cropperCss = cropperUrl.css,
    cropperJs = cropperUrl.js,
    editorId = `mev-${Math.random().toString(36).substr(3)}`
  } = props;

  useKeyBoard(props);

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

  // 初始为空，渲染到页面后获取页面属性
  let bodyOverflowHistory = '';
  useEffect(() => {
    bodyOverflowHistory = document.body.style.overflow;
  }, []);

  const adjustBody = () => {
    if (setting.pageFullScreen || setting.fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = bodyOverflowHistory;
    }
  };

  // 变化是调整一次
  useEffect(adjustBody, [setting.pageFullScreen, setting.fullscreen]);
  // ----end----

  const usedLanguageText = useMemo(() => {
    const allText: any = {
      ...staticTextDefault,
      ...languageUserDefined
    };

    if (allText[language]) {
      return allText[language];
    } else {
      return staticTextDefault['zh-CN'];
    }
  }, [props.language]);

  useEffect(() => {
    // 图标
    const iconfontScript = document.createElement('script');
    iconfontScript.src = iconfontJs;
    document.body.appendChild(iconfontScript);

    // prettier
    const prettierScript = document.createElement('script');
    const prettierMDScript = document.createElement('script');

    // 裁剪图片
    const cropperLink = document.createElement('link');
    cropperLink.rel = 'stylesheet';
    cropperLink.href = cropperCss;
    const cropperScript = document.createElement('script');
    cropperScript.src = cropperJs;

    document.body.appendChild(cropperLink);
    document.body.appendChild(cropperScript);

    if (prettier) {
      prettierScript.src = prettierCDN;
      prettierMDScript.src = prettierMDCDN;

      document.body.appendChild(prettierScript);
      document.body.appendChild(prettierMDScript);
    }

    // 监听上传图片
    !previewOnly &&
      bus.on({
        name: 'uploadImage',
        callback(files: FileList, cb: () => void) {
          const insertHanlder = (urls: Array<string>) => {
            urls.forEach((url) => {
              // 利用事件循环机制，保证两次插入分开进行
              setTimeout(() => {
                bus.emit('replace', 'image', {
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
        }
      });

    return () => {
      document.body.removeChild(iconfontScript);
      document.body.removeChild(cropperLink);
      document.body.removeChild(cropperScript);

      if (prettier) {
        document.body.removeChild(prettierScript);
        document.body.removeChild(prettierMDScript);
      }
    };
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editorId
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
      >
        {!previewOnly && (
          <ToolBar
            editorId={editorId}
            toolbars={toolbars}
            toolbarsExclude={toolbarsExclude}
            setting={setting}
            ult={usedLanguageText}
            updateSetting={updateSetting}
          />
        )}
        <Content
          hljs={props.hljs}
          value={props.modelValue}
          onChange={props.onChange}
          setting={setting}
          editorId={editorId}
          highlight={highlightUrl}
          previewOnly={props.previewOnly}
          ult={usedLanguageText}
          historyLength={props.historyLength}
          onHtmlChanged={props.onHtmlChanged}
          onGetCatalog={props.onGetCatalog}
        />
      </div>
    </EditorContext.Provider>
  );
};

Editor.defaultProps = {
  modelValue: '',
  theme: 'light',
  editorClass: '',
  toolbars: allToolbar,
  toolbarsExclude: [],
  preview: true,
  htmlPreview: false,
  iconfontJs: iconfontUrl,
  prettier: true,
  prettierCDN: prettierUrl.main,
  prettierMDCDN: prettierUrl.markdown,
  pageFullScreen: false,
  language: 'zh-CN',
  languageUserDefined: [],
  highlightJs: highlightUrl.js,
  highlightCss: highlightUrl.css,
  historyLength: 10,
  previewOnly: false,
  cropperCss: cropperUrl.css,
  cropperJs: cropperUrl.js
} as EditorProp;

export default Editor;
