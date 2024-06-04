import React, { useState, useEffect, forwardRef, ForwardedRef } from 'react';
import { useConfig, useExpansionPreview } from '~/hooks';
import { classnames, getNextId } from '~/utils';
import { prefix, defaultProps, defaultEditorId } from '~/config';
import { MdPreviewProps, MdPreviewStaticProps, Themes } from '~/type';
import bus from '~/utils/event-bus';

import { EditorContext } from '~/Editor';
import ContentPreview from '~/layouts/Content/ContentPreview';
import { useExpose } from './hooks/useExpose';

const MdPreview = forwardRef((props: MdPreviewProps, ref: ForwardedRef<unknown>) => {
  // Editor.defaultProps在某些编辑器中不能被正确识别已设置默认情况
  const {
    modelValue = defaultProps.modelValue,
    theme = defaultProps.theme as Themes,
    className = defaultProps.className,
    editorId = getNextId(defaultEditorId + '_'),
    showCodeRowNumber = defaultProps.showCodeRowNumber,
    previewTheme = defaultProps.previewTheme,
    noMermaid = defaultProps.noMermaid,
    noKatex = defaultProps.noKatex,
    onHtmlChanged = defaultProps.onHtmlChanged,
    onGetCatalog = defaultProps.onGetCatalog,
    sanitize = defaultProps.sanitize,
    mdHeadingId = defaultProps.mdHeadingId,
    noIconfont = defaultProps.noIconfont,
    noHighlight = defaultProps.noHighlight,
    noImgZoomIn = defaultProps.noImgZoomIn,
    language = defaultProps.language,
    sanitizeMermaid = defaultProps.sanitizeMermaid,
    codeFoldable = defaultProps.codeFoldable,
    autoFoldThreshold = defaultProps.autoFoldThreshold
  } = props;

  const [staticProps] = useState<MdPreviewStaticProps>(() => {
    return {
      editorId,
      noKatex,
      noMermaid,
      noIconfont,
      noHighlight
    };
  });

  // 扩展库引用
  useExpansionPreview(staticProps);
  // 部分配置重构
  const [highlight, usedLanguageText, setting] = useConfig(props);

  useExpose(staticProps, ref);

  useEffect(() => {
    return () => {
      // 清空所有的事件监听
      bus.clear(editorId);
    };
  }, [editorId]);

  return (
    <EditorContext.Provider
      value={{
        editorId: staticProps.editorId,
        tabWidth: 2,
        theme,
        language,
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
          setting.fullscreen || setting.pageFullscreen ? `${prefix}-fullscreen` : '',
          `${prefix}-previewOnly`
        ])}
        style={props.style}
      >
        <ContentPreview
          modelValue={modelValue}
          setting={setting}
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
        />
      </div>
    </EditorContext.Provider>
  );
});

export default MdPreview;
