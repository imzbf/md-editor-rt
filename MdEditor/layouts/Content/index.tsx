import React, { useContext, useRef } from 'react';
import { prefix } from '../../config';
import { EditorContext } from '../../Editor';
import {
  // useAutoGenrator,
  useAutoScroll,
  useCodeMirror,
  useMarked,
  useZoom
} from './hooks';
import { classnames } from '../../utils';
import { ContentProps } from './props';

const Content = (props: ContentProps) => {
  const { editorId, previewOnly, previewTheme, showCodeRowNumber } =
    useContext(EditorContext);
  // 输入状态，在输入中文等时，暂停保存
  // const completeStatus = useRef(true);
  // 输入框
  // const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);
  const { inputWrapperRef } = useCodeMirror(props);
  // markdown => html
  const { html } = useMarked(props);
  // 自动滚动
  useAutoScroll(props, html, '.cm-scroller', previewRef, htmlRef);
  // 历史记录
  // useHistory(props, textAreaRef, completeStatus);
  // 自动监听生成md内容
  // useAutoGenrator(props, textAreaRef);
  // 图片点击放大
  useZoom(props, html);

  // 原生属性
  // const attr = useMemo(() => {
  //   return omit(props, [
  //     'formatCopiedText',
  //     'markedHeadingId',
  //     'noKatex',
  //     'noMermaid',
  //     'onChange',
  //     'onGetCatalog',
  //     'onHtmlChanged',
  //     'sanitize',
  //     'scrollAuto',
  //     'setting',
  //     'autoDetectCode',
  //     'onBlur',
  //     'onFocus'
  //   ]);
  // }, [props]);

  return (
    <>
      <div className={`${prefix}-content`}>
        {!previewOnly && (
          <div className={`${prefix}-input-wrapper`} ref={inputWrapperRef}>
            {/* <textarea
              {...attr}
              id={`${editorId}-textarea`}
              className={
                props.setting.preview || props.setting.htmlPreview ? '' : 'textarea-only'
              }
              ref={textAreaRef}
              onBlur={(e) => {
                // 失焦自动保存当前选中内容
                bus.emit(editorId, 'selectTextChange');
                props.onBlur && props.onBlur(e);
              }}
              onFocus={props.onFocus}
              onKeyDown={() => {
                bus.emit(editorId, 'saveHistoryPos', true);
              }}
              onCompositionStart={() => {
                completeStatus.current = false;
              }}
              onInput={(e) => {
                onChange((e.target as HTMLTextAreaElement).value);
              }}
              onCompositionEnd={() => {
                completeStatus.current = true;
              }}
            /> */}
          </div>
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
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
        {props.setting.htmlPreview && (
          <div
            className={`${prefix}-preview-wrapper`}
            ref={htmlRef}
            key="html-preview-wrapper"
          >
            <div className={`${prefix}-html`}>{html}</div>
          </div>
        )}
      </div>
    </>
  );
};

export default React.memo(Content);
