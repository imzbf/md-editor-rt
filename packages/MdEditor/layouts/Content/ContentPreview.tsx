import React, { useContext, useMemo } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { classnames } from '~/utils';

import { useCopyCode, useMarkdownIt, useZoom } from './hooks';
import { ContentPreviewProps } from './props';

const ContentPreview = (props: ContentPreviewProps) => {
  const { previewOnly = false } = props;
  const { editorId, previewTheme, showCodeRowNumber } = useContext(EditorContext);

  // markdown => html
  const { html } = useMarkdownIt(props, !!previewOnly);
  // 复制代码
  useCopyCode(props, html);
  // 图片点击放大
  useZoom(props, html);

  const content = useMemo(() => {
    return (
      <article
        id={`${editorId}-preview`}
        className={classnames([
          `${prefix}-preview`,
          `${previewTheme}-theme`,
          showCodeRowNumber && `${prefix}-scrn`
        ])}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }, [editorId, html, previewTheme, showCodeRowNumber]);

  return (
    <>
      <div
        id={`${editorId}-preview-wrapper`}
        className={`${prefix}-preview-wrapper`}
        data-show={props.setting.preview}
        key="content-preview-wrapper"
      >
        {content}
      </div>
      {!previewOnly && (
        <div
          id={`${editorId}-html-wrapper`}
          className={`${prefix}-preview-wrapper`}
          data-show={props.setting.htmlPreview}
          key="html-preview-wrapper"
        >
          <div className={`${prefix}-html`}>{html}</div>
        </div>
      )}
    </>
  );
};

export default ContentPreview;
