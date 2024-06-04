import React, {
  useState,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useCallback
} from 'react';
import MdCatalog from '~~/MdCatalog';
import { EditorContext } from '~/Editor';
import { prefix } from '~/config';
import { useAutoScroll, useCodeMirror, useResize } from './hooks';
import { ContentProps } from './props';
import ContentPreview from './ContentPreview';
import { FocusOption } from '~/type';
import { ContentExposeParam } from './type';

const Content = forwardRef((props: ContentProps, ref: ForwardedRef<unknown>) => {
  const { onHtmlChanged } = props;
  const { editorId } = useContext(EditorContext);
  const [html, setHtml] = useState<string>('');

  const contentRef = useRef<HTMLDivElement>(null);
  const resizeRef = useRef<HTMLDivElement>(null);

  const onHtmlChangedCopy = useCallback(
    (_html: string) => {
      setHtml(_html);
      onHtmlChanged?.(_html);
    },
    [onHtmlChanged]
  );

  const { inputWrapperRef, codeMirrorUt, resetHistory } = useCodeMirror(props);
  const { inputWrapperStyle, resizeOperateStyle } = useResize(
    props,
    contentRef,
    resizeRef
  );
  // 自动滚动
  useAutoScroll(props, html, codeMirrorUt);

  useImperativeHandle(
    ref,
    (): ContentExposeParam => {
      return {
        getSelectedText() {
          return codeMirrorUt.current?.getSelectedText();
        },
        focus(options: FocusOption) {
          codeMirrorUt.current?.focus(options);
        },
        resetHistory
      };
    },
    [codeMirrorUt, resetHistory]
  );

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
        onHtmlChanged={onHtmlChangedCopy}
        onGetCatalog={props.onGetCatalog}
        mdHeadingId={props.mdHeadingId}
        noMermaid={props.noMermaid}
        sanitize={props.sanitize}
        noKatex={props.noKatex}
        formatCopiedText={props.formatCopiedText}
        noHighlight={props.noHighlight}
        noImgZoomIn={props.noImgZoomIn}
        sanitizeMermaid={props.sanitizeMermaid}
        codeFoldable={props.codeFoldable}
        autoFoldThreshold={props.autoFoldThreshold}
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
});

export default React.memo(Content);
