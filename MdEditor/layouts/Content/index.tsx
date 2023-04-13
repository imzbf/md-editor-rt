import React, { useContext, useRef } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { classnames } from '~/utils';
import {
  useAutoScroll,
  useCopyCode,
  useCodeMirror,
  useMarkdownIt,
  useZoom
} from './hooks';
import { ContentProps } from './props';

const Content = (props: ContentProps) => {
  const { editorId, previewOnly, previewTheme, showCodeRowNumber } =
    useContext(EditorContext);
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);
  const { inputWrapperRef, codeMirrorUt } = useCodeMirror(props);
  // markdown => html
  const { html } = useMarkdownIt(props);
  // 自动滚动
  useAutoScroll(props, html, previewRef, htmlRef, codeMirrorUt);
  // 复制代码
  useCopyCode(props, html);
  // 图片点击放大
  useZoom(props, html);

  return (
    <div className={`${prefix}-content`}>
      {!previewOnly && (
        <div className={`${prefix}-input-wrapper`} ref={inputWrapperRef}></div>
      )}
      {props.setting.preview && (
        <div
          id={`${editorId}-preview-wrapper`}
          className={`${prefix}-preview-wrapper`}
          ref={previewRef}
          key="content-preview-wrapper"
        >
          <article
            id={`${editorId}-preview`}
            className={classnames([
              `${prefix}-preview`,
              `${previewTheme}-theme`,
              showCodeRowNumber && `${prefix}-scrn`
            ])}
            dangerouslySetInnerHTML={{ __html: html.current }}
          />
        </div>
      )}
      {props.setting.htmlPreview && (
        <div
          className={`${prefix}-preview-wrapper`}
          ref={htmlRef}
          key="html-preview-wrapper"
        >
          <div className={`${prefix}-html`}>{html.current}</div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Content);
