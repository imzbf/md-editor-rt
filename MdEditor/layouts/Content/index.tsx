import React, { useContext, useMemo, useRef, FocusEvent } from 'react';
import { prefix } from '../../config';
import { EditorContext } from '../../Editor';
import { SettingType, HeadList, MarkedHeadingId } from '../../type';
import {
  useAutoGenrator,
  useHistory,
  useMarked,
  useAutoScroll,
  usePasteUpload,
  useZoom,
  useAttach
} from './hooks';
import { classnames, omit } from '../../utils';
import bus from '../../utils/event-bus';

export type EditorContentProp = Readonly<{
  value: string;
  onChange: (v: string) => void;
  setting: SettingType;
  onHtmlChanged?: (h: string) => void;
  onGetCatalog?: (list: HeadList[]) => void;
  // 不使用该功能
  noMermaid?: boolean;
  sanitize: (html: string) => string;
  placeholder: string;
  noKatex?: boolean;
  markedHeadingId: MarkedHeadingId;
  scrollAuto: boolean;
  formatCopiedText?: (text: string) => string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoDetectCode?: boolean;
  /**
   * 输入框失去焦点时触发事件
   */
  onBlur?: (event: FocusEvent<HTMLTextAreaElement, Element>) => void;
  /**
   * 输入框获得焦点时触发事件
   */
  onFocus?: (event: FocusEvent<HTMLTextAreaElement, Element>) => void;
}>;

const Content = (props: EditorContentProp) => {
  const { onChange } = props;
  const { editorId, previewOnly, previewTheme, showCodeRowNumber } =
    useContext(EditorContext);
  // 输入状态，在输入中文等时，暂停保存
  const completeStatus = useRef(true);
  // 输入框
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  // 预览框
  const previewRef = useRef<HTMLDivElement>(null);
  // html代码预览框
  const htmlRef = useRef<HTMLDivElement>(null);
  // markdown => html
  const { html } = useMarked(props);
  // 自动滚动
  useAutoScroll(props, html, textAreaRef, previewRef, htmlRef);
  // 历史记录
  useHistory(props, textAreaRef, completeStatus);
  // 自动监听生成md内容
  useAutoGenrator(props, textAreaRef);
  // 粘贴上传
  usePasteUpload(props, textAreaRef);
  // 图片点击放大
  useZoom(props, html);
  // 附带的设置
  useAttach(textAreaRef);

  // 原生属性
  const attr = useMemo(() => {
    return omit(props, [
      'formatCopiedText',
      'markedHeadingId',
      'noKatex',
      'noMermaid',
      'onChange',
      'onGetCatalog',
      'onHtmlChanged',
      'sanitize',
      'scrollAuto',
      'setting',
      'autoDetectCode',
      'onBlur',
      'onFocus'
    ]);
  }, [props]);

  return (
    <>
      <div className={`${prefix}-content`}>
        {!previewOnly && (
          <div className={`${prefix}-input-wrapper`}>
            <textarea
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
            />
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
