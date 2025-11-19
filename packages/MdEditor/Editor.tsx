import {
  useCallback,
  useState,
  forwardRef,
  ForwardedRef,
  useEffect,
  useRef,
  useMemo,
  memo
} from 'react';
import { prefix, defaultProps } from '~/config';
import Content from '~/layouts/Content';
import Footer from '~/layouts/Footer';
import ToolBar from '~/layouts/Toolbar';
import { ContextType, EditorProps, StaticProps, TableShapeType, Themes } from '~/type';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';
import { EditorContext } from './context';
import {
  useOnSave,
  useCatalog,
  useConfig,
  useErrorCatcher,
  useExpansion,
  useUploadImg,
  useExpose,
  useEditorId
} from './hooks';
import { ContentExposeParam } from './layouts/Content/type';

const Editor = forwardRef((props: EditorProps, ref: ForwardedRef<unknown>) => {
  // Editor.defaultProps在某些编辑器中不能被正确识别已设置默认情况
  const {
    value = props.modelValue || defaultProps.modelValue,
    theme = defaultProps.theme as Themes,
    codeTheme = defaultProps.codeTheme,
    className = defaultProps.className,
    toolbars = defaultProps.toolbars,
    toolbarsExclude = defaultProps.toolbarsExclude,
    defToolbars = defaultProps.defToolbars,
    tabWidth = defaultProps.tabWidth,
    showCodeRowNumber = defaultProps.showCodeRowNumber,
    previewTheme = defaultProps.previewTheme,
    noPrettier = defaultProps.noPrettier,
    tableShape = defaultProps.tableShape as TableShapeType,
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
    noUploadImg = defaultProps.noUploadImg,
    noHighlight = defaultProps.noHighlight,
    noImgZoomIn = defaultProps.noImgZoomIn,
    language = defaultProps.language,
    inputBoxWidth = defaultProps.inputBoxWidth,
    sanitizeMermaid = defaultProps.sanitizeMermaid,
    transformImgUrl = defaultProps.transformImgUrl,
    codeFoldable = defaultProps.codeFoldable,
    autoFoldThreshold = defaultProps.autoFoldThreshold,
    catalogLayout = defaultProps.catalogLayout as typeof props.catalogLayout,
    floatingToolbars = defaultProps.floatingToolbars,
    customIcon = defaultProps.customIcon,
    previewComponent,
    disabled,
    showToolbarName
  } = props;

  const editorId = useEditorId(props);

  const [staticProps] = useState<StaticProps>(() => {
    return {
      editorId,
      noKatex,
      noMermaid,
      noPrettier,
      noUploadImg,
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
  const rootRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<ContentExposeParam>(undefined);

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

  useExpose(ref, staticProps, catalogVisible, setting, updateSetting, codeRef);

  const contextValue = useMemo<ContextType>(() => {
    return {
      editorId: staticProps.editorId,
      tabWidth,
      theme,
      language,
      highlight,
      showCodeRowNumber,
      usedLanguageText,
      previewTheme,
      customIcon,
      rootRef,
      disabled,
      showToolbarName,
      setting,
      updateSetting,
      tableShape,
      catalogVisible,
      noUploadImg,
      noPrettier,
      codeTheme,
      defToolbars,
      floatingToolbars
    };
  }, [
    catalogVisible,
    codeTheme,
    customIcon,
    defToolbars,
    disabled,
    floatingToolbars,
    highlight,
    language,
    noPrettier,
    noUploadImg,
    previewTheme,
    setting,
    showCodeRowNumber,
    showToolbarName,
    staticProps.editorId,
    tabWidth,
    tableShape,
    theme,
    updateSetting,
    usedLanguageText
  ]);

  useEffect(() => {
    return () => {
      // 清空所有的事件监听
      bus.clear(staticProps.editorId);
    };
  }, [staticProps.editorId]);

  return (
    <EditorContext.Provider value={contextValue}>
      <div
        id={staticProps.editorId}
        className={classnames([
          prefix,
          !!className && className,
          theme === 'dark' && `${prefix}-dark`,
          (setting.fullscreen || setting.pageFullscreen) && `${prefix}-fullscreen`
        ])}
        style={props.style}
        ref={rootRef}
      >
        {toolbars.length > 0 && (
          <ToolBar toolbars={toolbars} toolbarsExclude={toolbarsExclude} />
        )}
        <Content
          ref={codeRef}
          modelValue={value}
          onChange={onChange}
          setting={setting}
          mdHeadingId={mdHeadingId}
          onHtmlChanged={onHtmlChanged}
          onGetCatalog={onGetCatalog}
          sanitize={sanitize}
          noMermaid={staticProps.noMermaid}
          noHighlight={staticProps.noHighlight}
          placeholder={placeholder}
          noKatex={staticProps.noKatex}
          scrollAuto={state.scrollAuto}
          formatCopiedText={props.formatCopiedText}
          autoFocus={props.autoFocus}
          readOnly={props.readOnly}
          maxLength={props.maxLength}
          autoDetectCode={props.autoDetectCode}
          onBlur={props.onBlur}
          onFocus={props.onFocus}
          onInput={props.onInput}
          completions={props.completions}
          noImgZoomIn={noImgZoomIn}
          onDrop={props.onDrop}
          inputBoxWidth={inputBoxWidth}
          onInputBoxWidthChange={props.onInputBoxWidthChange}
          sanitizeMermaid={sanitizeMermaid}
          transformImgUrl={transformImgUrl}
          codeFoldable={codeFoldable}
          autoFoldThreshold={autoFoldThreshold}
          onRemount={props.onRemount}
          catalogLayout={catalogLayout}
          catalogMaxDepth={props.catalogMaxDepth}
          noEcharts={props.noEcharts}
          previewComponent={previewComponent}
        />
        {footers.length > 0 && (
          <Footer
            modelValue={value}
            footers={footers}
            defFooters={defFooters}
            noScrollAuto={
              (!setting.preview && !setting.htmlPreview) || setting.previewOnly
            }
            scrollAuto={state.scrollAuto}
            onScrollAutoChange={onScrollAutoChange}
          />
        )}
      </div>
    </EditorContext.Provider>
  );
});

export default memo(Editor);
