import React, { useState, useContext } from 'react';
import { EditorContext } from '~/Editor';
import { prefix } from '~/config';
import MdCatalog from '~~/MdCatalog';
import ContentPreview from './ContentPreview';
import { useAutoScroll, useCodeMirror } from './hooks';
import { ContentProps } from './props';

const Content = (props: ContentProps) => {
  const { editorId } = useContext(EditorContext);
  const [html, setHtml] = useState<string>('');

  const { inputWrapperRef, codeMirrorUt } = useCodeMirror(props);
  // 自动滚动
  useAutoScroll(props, html, codeMirrorUt);

  return (
    <div className={`${prefix}-content`}>
      <div className={`${prefix}-input-wrapper`} ref={inputWrapperRef}></div>
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
