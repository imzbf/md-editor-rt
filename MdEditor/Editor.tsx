import React, { createContext, useCallback, useState } from 'react';
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
import { prefix, staticTextDefault, defaultProps } from './config';
import { ContentType, EditorProp, ConfigOption, Themes } from './type';
import DropdownToolbar from './extensions/DropdownToolbar';
import NormalToolbar from './extensions/NormalToolbar';
import ModalToolbar from './extensions/ModalToolbar';
import MdCatalog from './extensions/MdCatalog';

import './styles/index.less';
import '@vavt/markdown-theme/css/all.css';
import { classnames } from './utils';

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
    modelValue = defaultProps.modelValue,
    theme = defaultProps.theme as Themes,
    className = defaultProps.className,
    toolbars = defaultProps.toolbars,
    toolbarsExclude = defaultProps.toolbarsExclude,
    defToolbars = defaultProps.defToolbars,
    previewOnly = defaultProps.previewOnly,
    editorId = defaultProps.editorId,
    tabWidth = defaultProps.tabWidth,
    historyLength = defaultProps.historyLength,
    showCodeRowNumber = defaultProps.showCodeRowNumber,
    previewTheme = defaultProps.previewTheme,
    noPrettier = defaultProps.noPrettier,
    tableShape = defaultProps.tableShape as [number, number],
    noMermaid = defaultProps.noMermaid,
    noKatex = defaultProps.noKatex,
    placeholder = defaultProps.placeholder,
    onChange = defaultProps.onChange,
    onHtmlChanged = defaultProps.onHtmlChanged,
    onGetCatalog = defaultProps.onGetCatalog,
    sanitize = defaultProps.sanitize,
    onError = defaultProps.onError,
    markedHeadingId = defaultProps.markedHeadingId,
    footers = defaultProps.footers,
    defFooters = defaultProps.defFooters
  } = props;

  const extension = Editor.extension as ConfigOption;

  const [state, setState] = useState<{
    scrollAuto: boolean;
  }>(() => {
    return {
      scrollAuto: props.scrollAuto === undefined ? true : !!props.scrollAuto
    };
  });

  const onScrollAutoChange = useCallback(
    (v: boolean) => {
      setState((_state) => {
        return {
          ..._state,
          scrollAuto: v
        };
      });
    },
    [setState]
  );

  // 快捷键监听
  useKeyBoard(props);
  // 扩展库引用
  useExpansion(props, extension);
  // 上传图片监控
  useUploadImg(props);
  // 错误捕获
  useErrorCatcher(editorId, onError);
  // 目录状态
  const { catalogShow, catalogStyle } = useCatalog(props);
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
        className={classnames([
          prefix,
          className,
          theme === 'dark' && `${prefix}-dark`,
          setting.fullscreen || setting.pageFullScreen ? `${prefix}-fullscreen` : '',
          previewOnly && `${prefix}-previewOnly`
        ])}
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
            defToolbars={defToolbars}
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
            modelValue={modelValue}
            footers={footers}
            defFooters={defFooters}
            scrollAuto={state.scrollAuto}
            onScrollAutoChange={onScrollAutoChange}
          />
        )}
        {catalogShow && (
          <MdCatalog
            theme={theme}
            style={catalogStyle}
            className={`${prefix}-catalog-editor`}
            editorId={editorId}
            markedHeadingId={markedHeadingId}
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
