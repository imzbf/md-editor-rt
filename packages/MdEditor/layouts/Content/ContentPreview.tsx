import React, { useContext } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { classnames } from '~/utils';

import { useCopyCode, useMarkdownIt, useZoom } from './hooks';

import type { HeadList, SettingType, MdHeadingId } from '~/type';

export interface ContentPreviewProps {
  value: string;
  setting: SettingType;
  onHtmlChanged?: (h: string) => void;
  onGetCatalog?: (list: HeadList[]) => void;
  mdHeadingId: MdHeadingId;
  noMermaid?: boolean;
  sanitize: (html: string) => string;
  noKatex?: boolean;
  formatCopiedText?: (text: string) => string;
  noHighlight?: boolean;
  previewOnly?: boolean;
}

const ContentPreview = (props: ContentPreviewProps) => {
  const { editorId, previewTheme, showCodeRowNumber } = useContext(EditorContext);

  // markdown => html
  const { html } = useMarkdownIt(props, !!props.previewOnly);
  // 复制代码
  useCopyCode(props, html);
  // 图片点击放大
  useZoom(props, html);

  return (
    <>
      <div
        id={`${editorId}-preview-wrapper`}
        className={`${prefix}-preview-wrapper`}
        data-show={props.setting.preview}
        key="content-preview-wrapper"
      >
        <article
          id={`${editorId}-preview`}
          className={classnames([
            `${prefix}-preview`,
            `${previewTheme}-theme`,
            showCodeRowNumber && `${prefix}-scrn`
          ])}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
      {!props.previewOnly && (
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

ContentPreview.defaultProps = {
  previewOnly: false
};

export default ContentPreview;
