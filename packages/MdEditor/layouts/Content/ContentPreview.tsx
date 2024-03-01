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
  const { html, key } = useMarkdownIt(props, !!previewOnly);
  // 复制代码
  useCopyCode(props, html, key);
  // 图片点击放大
  useZoom(props, html);

  const content = useMemo(() => {
    return (
      <div
        id={`${editorId}-preview`}
        key={key}
        className={classnames([
          `${prefix}-preview`,
          `${previewTheme}-theme`,
          showCodeRowNumber && `${prefix}-scrn`
        ])}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }, [editorId, html, key, previewTheme, showCodeRowNumber]);

  return (
    <>
      {props.setting.preview && (
        <div
          id={`${editorId}-preview-wrapper`}
          className={`${prefix}-preview-wrapper`}
          key="content-preview-wrapper"
        >
          {content}
        </div>
      )}
      {!previewOnly && props.setting.htmlPreview && (
        <div
          id={`${editorId}-html-wrapper`}
          className={`${prefix}-preview-wrapper`}
          key="html-preview-wrapper"
        >
          <div className={`${prefix}-html`}>{html}</div>
        </div>
      )}
    </>
  );
};

export default ContentPreview;
