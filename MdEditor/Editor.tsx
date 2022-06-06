import React, { createContext, useState } from 'react';
import {
  useCatalog,
  useConfig,
  useErrorCatcher,
  useExpansion,
  useKeyBoard,
  useUploadImg
} from './hooks';
import ToolBar from './layouts/Toolbar';
import Content from './layouts/Content';
import Footer from './layouts/Footer';
import configFn from './utils/config';
import {
  prefix,
  allToolbar,
  staticTextDefault,
  defaultEditorId,
  allFooter
} from './config';
import { ContentType, EditorProp, ConfigOption } from './type';
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

const Editor = (props: EditorProp) => {
  const {
    modelValue = '',
    theme = 'light',
    className = '',
    toolbars = allToolbar,
    toolbarsExclude = [],
    previewOnly = false,
    editorId = defaultEditorId,
    tabWidth = 2,
    historyLength = 10,
    showCodeRowNumber = false,
    previewTheme = 'default',
    noPrettier = false,
    tableShape = [6, 4],
    noMermaid = false,
    noKatex = false,
    placeholder = '',
    onChange = () => {},
    onHtmlChanged = () => {},
    onGetCatalog = () => {},
    sanitize = (text) => text,
    onError = () => {},
    markedHeadingId = (text) => text,
    footers = allFooter,
    defFooters = []
  } = props;

  const extension = Editor.extension as ConfigOption;

  const [state, setState] = useState<{
    scrollAuto: boolean;
  }>(() => {
    return {
      scrollAuto: props.scrollAuto === undefined ? true : !!props.scrollAuto
    };
  });

  // 快捷键监听
  useKeyBoard(props);
  // 扩展库引用
  useExpansion(props, extension);
  // 上传图片监控
  useUploadImg(props);
  // 错误捕获
  useErrorCatcher(editorId, onError);
  // 目录状态
  const [catalogVisible, catalogShow] = useCatalog(props);
  // 部分配置重构
  const [highlight, usedLanguageText, setting, updateSetting] = useConfig(
    props,
    extension
  );

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
        extension: extension
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
            noPrettier={noPrettier}
            // screenfull={screenfull}
            // screenfullJs={screenfullJs}
            toolbars={toolbars}
            toolbarsExclude={toolbarsExclude}
            setting={setting}
            updateSetting={updateSetting}
            tableShape={tableShape}
            defToolbars={props.defToolbars}
          />
        )}
        <Content
          // hljs={props.hljs}
          // highlightSet={highlightSet}
          // mermaid={props.mermaid}
          // mermaidJs={props.mermaidJs}
          value={modelValue}
          onChange={onChange}
          setting={setting}
          onHtmlChanged={onHtmlChanged}
          onGetCatalog={onGetCatalog}
          // markedHeading={props.markedHeading}
          sanitize={sanitize}
          noMermaid={noMermaid}
          placeholder={placeholder}
          // katex={props.katex}
          // katexJs={props.katexJs}
          // katexCss={props.katexCss}
          noKatex={noKatex}
          // extensions={props.extensions}
          // markedImage={props.markedImage}
          mermaidTemplate={extension?.editorConfig?.mermaidTemplate}
          markedHeadingId={markedHeadingId}
          scrollAuto={state.scrollAuto}
        />
        {!previewOnly && footers?.length > 0 && (
          <Footer
            modelValue={props.modelValue}
            footers={footers}
            defFooters={defFooters}
            scrollAuto={state.scrollAuto}
            onScrollAutoChange={(v) => {
              setState((_state) => {
                return {
                  ..._state,
                  scrollAuto: v
                };
              });
            }}
          />
        )}
        {catalogShow && (
          <MdCatalog
            theme={props.theme}
            style={{
              display: catalogVisible ? 'block' : 'none'
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

Editor.DropdownToolbar = DropdownToolbar;
Editor.NormalToolbar = NormalToolbar;
Editor.MdCatalog = MdCatalog;
Editor.ModalToolbar = ModalToolbar;
Editor.config = configFn;
Editor.extension = {};

export * from './type';

export default Editor;
