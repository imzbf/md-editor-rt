import React, { useEffect, useMemo, useState } from 'react';
import cn from 'classnames';
import ToolBar from './layouts/Toolbar';
import {
  allToolbar,
  highlightUrl,
  iconfontUrl,
  prettierUrl,
  cropperUrl,
  staticTextDefault
} from './config';

// import bus from './utils/event-bus';
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
}

// 生成唯一ID
const editorId = `mev-${Math.random().toString(36).substr(3)}`;

const Editor = (props: EditorProp) => {
  const {
    theme = 'light',
    editorClass = '',
    toolbars = allToolbar,
    toolbarsExclude = [],
    preview = false,
    htmlPreview = false,
    iconfontJs = iconfontUrl,
    prettier = true,
    prettierCDN = prettierUrl.main,
    prettierMDCDN = prettierUrl.markdown,
    previewOnly,
    pageFullScreen = false,
    language = 'zh-CN',
    languageUserDefined = []
  } = props;

  // ----编辑器设置----
  const [setting, setSetting] = useState<SettingType>({
    pageFullScreen: pageFullScreen,
    fullscreen: false,
    preview: preview,
    htmlPreview: preview ? false : htmlPreview
  });

  const updateSetting = (v: any, k: keyof typeof setting) => {
    setting[k] = v;

    setSetting((settingN) => {
      return {
        ...settingN,
        [k]: v,
        preview: k === 'htmlPreview' && settingN.htmlPreview ? false : settingN.preview,
        htmlPreview: k === 'preview' && setting.preview ? false : settingN.htmlPreview
      };
    });
  };

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

    if (prettier) {
      prettierScript.src = prettierCDN;
      prettierMDScript.src = prettierMDCDN;

      document.body.appendChild(prettierScript);
      document.body.appendChild(prettierMDScript);
    }

    return () => {
      document.body.removeChild(iconfontScript);

      if (prettier) {
        document.body.removeChild(prettierScript);
        document.body.removeChild(prettierMDScript);
      }
    };
  });

  return (
    <div
      id={editorId}
      className={cn([prefix, editorClass, theme === 'dark' && `${prefix}-dark`])}
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
    </div>
  );
};

Editor.defaultProps = {
  highlightJs: highlightUrl.js,
  highlightCss: highlightUrl.css,
  historyLength: 10,
  previewOnly: false,
  cropperCss: cropperUrl.css,
  cropperJs: cropperUrl.js
} as EditorProp;

export default Editor;
