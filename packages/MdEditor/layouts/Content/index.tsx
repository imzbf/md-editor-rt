import React, { useState } from 'react';
import { prefix } from '~/config';
import ContentPreview from './ContentPreview';
import { useAutoScroll, useCodeMirror } from './hooks';
import { ContentProps } from './props';

const Content = (props: ContentProps) => {
  const [html, setHtml] = useState<string>('');

  const { inputWrapperRef, codeMirrorUt } = useCodeMirror(props);
  // 自动滚动
  useAutoScroll(props, html, codeMirrorUt);

  return (
    <div className={`${prefix}-content`}>
      <div className={`${prefix}-input-wrapper`} ref={inputWrapperRef}></div>
      <ContentPreview
        value={props.value}
        setting={props.setting}
        onHtmlChanged={(html_) => {
          setHtml(html_);
          props.onHtmlChanged(html_);
        }}
        onGetCatalog={props.onGetCatalog}
        mdHeadingId={props.mdHeadingId}
        noMermaid={props.noMermaid}
        sanitize={props.sanitize}
        noKatex={props.noKatex}
        formatCopiedText={props.formatCopiedText}
        noHighlight={props.noHighlight}
        key="display-editor"
      />
    </div>
  );
};

export default React.memo(Content);
