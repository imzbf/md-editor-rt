import {
  useState,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useCallback,
  memo,
  MouseEvent
} from 'react';
import { createSmoothScroll } from '@vavt/util';
import MdCatalog, { TocItem } from '~~/MdCatalog';
import { prefix } from '~/config';
import { FocusOption } from '~/type';
import { EditorContext } from '~/context';
import { useAutoScroll, useCodeMirror, useResize } from './hooks';
import { ContentProps } from './props';
import { ContentExposeParam } from './type';
import ContentPreview from './ContentPreview';

const smoothScroll = createSmoothScroll();

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

  useImperativeHandle(ref, (): ContentExposeParam => {
    return {
      getSelectedText() {
        return codeMirrorUt.current?.getSelectedText();
      },
      focus(options: FocusOption) {
        codeMirrorUt.current?.focus(options);
      },
      resetHistory,
      getEditorView() {
        return codeMirrorUt.current?.view;
      }
    };
  }, [codeMirrorUt, resetHistory]);

  const onCatalogClick = useCallback(
    (e: MouseEvent, toc: TocItem) => {
      // 如果没有预览区域，就将目录与编辑器同步滚动
      if (!props.setting.preview && toc.line !== undefined) {
        e.preventDefault();
        const view = codeMirrorUt.current?.view;

        if (view) {
          const line = view.state.doc.line(toc.line + 1);

          const top = view.lineBlockAt(line.from)?.top;

          const scroller = view.scrollDOM;
          smoothScroll(scroller, top); // 滚动到目标行
        }
      }
    },
    [codeMirrorUt, props.setting.preview]
  );

  return (
    <div className={`${prefix}-content`}>
      <div className={`${prefix}-content-wrapper`} ref={contentRef}>
        <div
          className={`${prefix}-input-wrapper`}
          style={inputWrapperStyle}
          ref={inputWrapperRef}
        />
        {/* 拖拽入口需要保持props.setting变化时就挂载 */}
        {(props.setting.htmlPreview || props.setting.preview) && (
          <div
            className={`${prefix}-resize-operate`}
            style={resizeOperateStyle}
            ref={resizeRef}
          />
        )}
        <ContentPreview
          modelValue={props.modelValue}
          onChange={props.onChange}
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
          onRemount={props.onRemount}
          htmlUpdateOnDemand={props.htmlUpdateOnDemand}
        />
      </div>
      {props.catalogVisible && (
        <MdCatalog
          theme={props.theme}
          className={`${prefix}-catalog-editor ${prefix}-catalog-${props.catalogLayout}`}
          editorId={editorId}
          mdHeadingId={props.mdHeadingId}
          key="internal-catalog"
          scrollElementOffsetTop={2}
          syncWith={!props.setting.preview ? 'editor' : 'preview'}
          onClick={onCatalogClick}
        />
      )}
    </div>
  );
});

export default memo(Content);
