import React, { useState, useEffect } from 'react';
import { useConfig, useExpansionPreview } from '~/hooks';
import { classnames } from '~/utils';
import { prefix, defaultProps } from '~/config';
import { MdPreviewProps, MdPreviewStaticProps, Themes } from '~/type';
import bus from '~/utils/event-bus';

import { EditorContext } from '~/Editor';
import ContentPreview from '~/layouts/Content/ContentPreview';

const MdPreview = (props: MdPreviewProps) => {
  // Editor.defaultProps在某些编辑器中不能被正确识别已设置默认情况
  const {
    modelValue = defaultProps.modelValue,
    theme = defaultProps.theme as Themes,
    className = defaultProps.className,
    editorId = defaultProps.editorId,
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
    noImgZoomIn = defaultProps.noImgZoomIn
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
        tabWidth: 2,
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
        />
      </div>
    </EditorContext.Provider>
  );
};

export default MdPreview;
