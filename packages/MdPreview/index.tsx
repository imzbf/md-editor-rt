import { useState, useEffect, forwardRef, ForwardedRef, useRef, useMemo } from 'react';
import { prefix, defaultProps } from '~/config';
import { EditorContext } from '~/context';
import { useMdPreviewConfig, useEditorId } from '~/hooks';
import ContentPreview from '~/layouts/Content/ContentPreview';
import { ContextType, MdPreviewProps, MdPreviewStaticProps, Themes } from '~/type';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

import { useExpose } from './hooks/useExpose';

const MdPreview = forwardRef((props: MdPreviewProps, ref: ForwardedRef<unknown>) => {
  // Editor.defaultProps在某些编辑器中不能被正确识别已设置默认情况
  const {
    value = props.modelValue || defaultProps.modelValue,
    onChange = defaultProps.onChange,
    theme = defaultProps.theme as Themes,
    className = defaultProps.className,
    showCodeRowNumber = defaultProps.showCodeRowNumber,
    previewTheme = defaultProps.previewTheme,
    noMermaid = defaultProps.noMermaid,
    noKatex = defaultProps.noKatex,
    onHtmlChanged = defaultProps.onHtmlChanged,
    onGetCatalog = defaultProps.onGetCatalog,
    sanitize = defaultProps.sanitize,
    mdHeadingId = defaultProps.mdHeadingId,
    noHighlight = defaultProps.noHighlight,
    noImgZoomIn = defaultProps.noImgZoomIn,
    language = defaultProps.language,
    sanitizeMermaid = defaultProps.sanitizeMermaid,
    codeFoldable = defaultProps.codeFoldable,
    autoFoldThreshold = defaultProps.autoFoldThreshold,
    codeTheme = defaultProps.codeTheme,
    previewComponent
  } = props;

  const editorId = useEditorId(props);

  const [staticProps] = useState<MdPreviewStaticProps>(() => {
    return {
      editorId,
      noKatex,
      noMermaid,
      noHighlight
    };
  });
  const rootRef = useRef<HTMLDivElement>(null);

  // 部分配置重构
  const [highlight, usedLanguageText] = useMdPreviewConfig(props);

  useExpose(staticProps, ref);

  useEffect(() => {
    return () => {
      // 清空所有的事件监听
      bus.clear(editorId);
    };
  }, [editorId]);

  const providerValue = useMemo<ContextType>(() => {
    return {
      editorId: staticProps.editorId,
      tabWidth: 2,
      theme,
      language,
      highlight,
      showCodeRowNumber,
      usedLanguageText,
      previewTheme,
      customIcon: props.customIcon || {},
      rootRef,
      disabled: false,
      showToolbarName: false,
      setting: {
        preview: true,
        htmlPreview: false,
        previewOnly: false,
        pageFullscreen: false,
        fullscreen: false
      },
      updateSetting: () => {},
      tableShape: [6, 4],
      catalogVisible: false,
      noUploadImg: true,
      noPrettier: true,
      codeTheme,
      defToolbars: [],
      floatingToolbars: []
    };
  }, [
    codeTheme,
    highlight,
    language,
    previewTheme,
    props.customIcon,
    showCodeRowNumber,
    staticProps.editorId,
    theme,
    usedLanguageText
  ]);

  return (
    <EditorContext.Provider value={providerValue}>
      <div
        id={staticProps.editorId}
        className={classnames([
          prefix,
          className,
          props.theme === 'dark' && `${prefix}-dark`,
          `${prefix}-previewOnly`
        ])}
        style={props.style}
        ref={rootRef}
      >
        <ContentPreview
          modelValue={value}
          onChange={onChange}
          mdHeadingId={mdHeadingId}
          onHtmlChanged={onHtmlChanged}
          onGetCatalog={onGetCatalog}
          sanitize={sanitize}
          noMermaid={staticProps.noMermaid}
          noHighlight={staticProps.noHighlight}
          noKatex={staticProps.noKatex}
          formatCopiedText={props.formatCopiedText}
          noImgZoomIn={noImgZoomIn}
          previewOnly
          key="preview-only"
          sanitizeMermaid={sanitizeMermaid}
          codeFoldable={codeFoldable}
          autoFoldThreshold={autoFoldThreshold}
          onRemount={props.onRemount}
          noEcharts={props.noEcharts}
          previewComponent={previewComponent}
        />
      </div>
    </EditorContext.Provider>
  );
});

export default MdPreview;
