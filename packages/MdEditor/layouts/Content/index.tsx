import { createSmoothScroll } from '@vavt/util';
import {
  useState,
  useContext,
  useRef,
  useImperativeHandle,
  forwardRef,
  ForwardedRef,
  useCallback,
  memo,
  MouseEvent,
  useMemo
} from 'react';
import CustomScrollbar from '~/components/CustomScrollbar';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { FocusOption } from '~/type';
import MdCatalog, { TocItem } from '~~/MdCatalog';
import ContentPreview from './ContentPreview';
import { useAutoScroll, useCodeMirror, useFollowCatalog, useResize } from './hooks';
import { ContentProps } from './props';
import { ContentExposeParam } from './type';

const smoothScroll = createSmoothScroll();
const PREVIEW_SCROLLBAR_STYLE = { flex: 1 };

const Content = forwardRef((props: ContentProps, ref: ForwardedRef<unknown>) => {
  const { onHtmlChanged } = props;
  const { editorId, theme, catalogVisible, setting } = useContext(EditorContext);
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

  // 跟随目录
  const { onCatalogActive, onMouseEnter, onMouseLeave } = useFollowCatalog();

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
      if (!setting.preview && toc.line !== undefined) {
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
    [codeMirrorUt, setting.preview]
  );

  const inputWrapper = useMemo(() => {
    return <div className={`${prefix}-input-wrapper`} ref={inputWrapperRef} />;
  }, [inputWrapperRef]);

  const contentPreview = useMemo(() => {
    return (
      <ContentPreview
        modelValue={props.modelValue}
        onChange={props.onChange}
        setting={setting}
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
        previewComponent={props.previewComponent}
      />
    );
  }, [
    onHtmlChangedCopy,
    props.autoFoldThreshold,
    props.codeFoldable,
    props.formatCopiedText,
    props.mdHeadingId,
    props.modelValue,
    props.noHighlight,
    props.noImgZoomIn,
    props.noKatex,
    props.noMermaid,
    props.onChange,
    props.onGetCatalog,
    props.onRemount,
    props.previewComponent,
    props.sanitize,
    props.sanitizeMermaid,
    setting
  ]);

  const catalog = useMemo(() => {
    return (
      <MdCatalog
        theme={theme}
        className={`${prefix}-catalog-editor`}
        editorId={editorId}
        mdHeadingId={props.mdHeadingId}
        key="internal-catalog"
        scrollElementOffsetTop={2}
        syncWith={!setting.preview ? 'editor' : 'preview'}
        onClick={onCatalogClick}
        catalogMaxDepth={props.catalogMaxDepth}
        onActive={onCatalogActive}
      />
    );
  }, [
    editorId,
    onCatalogActive,
    onCatalogClick,
    props.catalogMaxDepth,
    props.mdHeadingId,
    setting.preview,
    theme
  ]);

  return (
    <div className={`${prefix}-content`}>
      <div className={`${prefix}-content-wrapper`} ref={contentRef}>
        <CustomScrollbar
          alwaysShowTrack
          scrollTarget={`#${editorId} .cm-scroller`}
          style={inputWrapperStyle}
        >
          {inputWrapper}
        </CustomScrollbar>
        {/* 拖拽入口需要保持setting变化时就挂载 */}
        {(setting.htmlPreview || setting.preview) && (
          <div
            className={`${prefix}-resize-operate`}
            style={resizeOperateStyle}
            ref={resizeRef}
          />
        )}
        <CustomScrollbar style={PREVIEW_SCROLLBAR_STYLE}>
          {contentPreview}
        </CustomScrollbar>
      </div>
      {catalogVisible && (
        <CustomScrollbar
          className={`${prefix}-catalog-${props.catalogLayout}`}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {catalog}
        </CustomScrollbar>
      )}
    </div>
  );
});

export default memo(Content);
