import React, {
  createContext,
  useCallback,
  useState,
  forwardRef,
  ForwardedRef,
  useEffect
} from 'react';
import {
  useOnSave,
  useCatalog,
  useConfig,
  useErrorCatcher,
  useExpansion,
  useUploadImg,
  useExpose
} from './hooks';
import ToolBar from '~/layouts/Toolbar';
import Content from '~/layouts/Content';
import Footer from '~/layouts/Footer';
import { classnames } from '~/utils';
import { prefix, staticTextDefault, defaultProps } from '~/config';
import { ContentType, EditorProps, StaticProps, Themes } from '~/type';
import bus from '~/utils/event-bus';

export const EditorContext = createContext<ContentType>({
  editorId: '',
  tabWidth: 2,
  theme: 'light',
  highlight: {
    css: '',
    js: ''
  },
  showCodeRowNumber: false,
  usedLanguageText: staticTextDefault['zh-CN'],
  previewTheme: 'default',
  customIcon: {}
});

const Editor = forwardRef((props: EditorProps, ref: ForwardedRef<unknown>) => {
  // Editor.defaultProps在某些编辑器中不能被正确识别已设置默认情况
  const {
    modelValue = defaultProps.modelValue,
    theme = defaultProps.theme as Themes,
    className = defaultProps.className,
    toolbars = defaultProps.toolbars,
    toolbarsExclude = defaultProps.toolbarsExclude,
    defToolbars = defaultProps.defToolbars,
    editorId = defaultProps.editorId,
    tabWidth = defaultProps.tabWidth,
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
    mdHeadingId = defaultProps.mdHeadingId,
    footers = defaultProps.footers,
    defFooters = defaultProps.defFooters,
    noIconfont = defaultProps.noIconfont,
    noUploadImg = defaultProps.noUploadImg,
    noHighlight = defaultProps.noHighlight,
    noImgZoomIn = defaultProps.noImgZoomIn
  } = props;

  const [staticProps] = useState<StaticProps>(() => {
    return {
      editorId,
      noKatex,
      noMermaid,
      noPrettier,
      noUploadImg,
      noIconfont,
      noHighlight
    };
  });

  const [state, setState] = useState<{
    scrollAuto: boolean;
  }>(() => {
    return {
      scrollAuto: props.scrollAuto === undefined ? true : props.scrollAuto
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
  useOnSave(props, staticProps);
  // 扩展库引用
  useExpansion(staticProps);
  // 上传图片监控
  useUploadImg(props, staticProps);
  // 错误捕获
  useErrorCatcher(staticProps.editorId, onError);
  // 目录状态
  const catalogVisible = useCatalog(props, staticProps);
  // 部分配置重构
  const [highlight, usedLanguageText, setting, updateSetting] = useConfig(props);

  useExpose(ref, staticProps, catalogVisible, setting, updateSetting);

  useEffect(() => {
    return () => {
      // 清空所有的事件监听
      bus.clear(editorId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EditorContext.Provider
      value={{
        editorId: staticProps.editorId,
        tabWidth,
        theme,
        highlight,
        showCodeRowNumber,
        usedLanguageText,
        previewTheme,
        customIcon: props.customIcon || {}
      }}
    >
      <div
        id={staticProps.editorId}
        className={classnames([
          prefix,
          className,
          theme === 'dark' && `${prefix}-dark`,
          setting.fullscreen || setting.pageFullscreen ? `${prefix}-fullscreen` : ''
        ])}
        style={props.style}
      >
        <ToolBar
          noPrettier={staticProps.noPrettier}
          toolbars={toolbars}
          toolbarsExclude={toolbarsExclude}
          setting={setting}
          updateSetting={updateSetting}
          tableShape={tableShape}
          defToolbars={defToolbars}
          noUploadImg={staticProps.noUploadImg}
          showToolbarName={props.showToolbarName}
        />
        <Content
          modelValue={modelValue}
          onChange={onChange}
          setting={setting}
          mdHeadingId={mdHeadingId}
          onHtmlChanged={onHtmlChanged}
          onGetCatalog={onGetCatalog}
          sanitize={sanitize}
          noMermaid={staticProps.noMermaid}
          noPrettier={staticProps.noPrettier}
          noHighlight={staticProps.noHighlight}
          placeholder={placeholder}
          noKatex={staticProps.noKatex}
          scrollAuto={state.scrollAuto}
          formatCopiedText={props.formatCopiedText}
          autoFocus={props.autoFocus}
          disabled={props.disabled}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          autoDetectCode={props.autoDetectCode}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onInput={props.onInput}
          completions={props.completions}
          catalogVisible={catalogVisible}
          theme={props.theme}
          noImgZoomIn={noImgZoomIn}
          onDrop={props.onDrop}
        />
        {footers?.length > 0 && (
          <Footer
            modelValue={modelValue}
            footers={footers}
            defFooters={defFooters}
            scrollAuto={state.scrollAuto}
            onScrollAutoChange={onScrollAutoChange}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
});

export default Editor;
