import React, { useState, useContext, useRef } from 'react';
import MdCatalog from '~~/MdCatalog';
import { EditorContext } from '~/Editor';
import { prefix } from '~/config';
import { useAutoScroll, useCodeMirror, useResize } from './hooks';
import { ContentProps } from './props';
import ContentPreview from './ContentPreview';

const Content = (props: ContentProps) => {
  const { editorId } = useContext(EditorContext);
  const [html, setHtml] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const { inputWrapperRef, codeMirrorUt } = useCodeMirror(props);
  const { inputWrapperStyle, resizeOperateStyle } = useResize(
    props,
    contentRef,
    resizeRef
  );
  // 自动滚动
  useAutoScroll(props, html, codeMirrorUt);

  return (
    <div
      className={`${prefix}-content${
        props.setting.htmlPreview || props.setting.preview ? ' has-preview' : ''
      }`}
      ref={contentRef}
    >
      <div
        className={`${prefix}-input-wrapper`}
        style={inputWrapperStyle}
        ref={inputWrapperRef}
      />
      {(props.setting.htmlPreview || props.setting.preview) && (
        <div
          className={`${prefix}-resize-operate`}
          style={resizeOperateStyle}
          ref={resizeRef}
        />
      )}
      <ContentPreview
        modelValue={props.modelValue}
        setting={props.setting}
        onHtmlChanged={(html_) => {
          setHtml(html_);
          props.onHtmlChanged && props.onHtmlChanged(html_);
        }}
        onGetCatalog={props.onGetCatalog}
        mdHeadingId={props.mdHeadingId}
        noMermaid={props.noMermaid}
        sanitize={props.sanitize}
        noKatex={props.noKatex}
        formatCopiedText={props.formatCopiedText}
        noHighlight={props.noHighlight}
        noImgZoomIn={props.noImgZoomIn}
        sanitizeMermaid={props.sanitizeMermaid}
        key="display-editor"
      />
      {props.catalogVisible && (
        <MdCatalog
          theme={props.theme}
          className={`${prefix}-catalog-editor`}
          editorId={editorId}
          mdHeadingId={props.mdHeadingId}
          key="internal-catalog"
        />
      )}
    </div>
  );
};

export default React.memo(Content);
