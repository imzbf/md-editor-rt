import { RefObject, useContext, useEffect, useState } from 'react';
import { EditorContext } from '~/context';
import scrollAuto, { scrollAutoWithScale } from '~/utils/scroll-auto';
import CodeMirrorUt from '../codemirror';
import { ContentProps } from '../props';

/**
 * 自动滚动
 *
 * @param props
 * @param html
 * @param previewRef
 * @param htmlRef
 * @param codeMirrorUt
 */
const useAutoScroll = (
  props: ContentProps,
  html: string,
  codeMirrorUt: RefObject<CodeMirrorUt | undefined>
) => {
  const { editorId, setting } = useContext(EditorContext);
  const [scrollCb, setScrollCb] = useState({
    clear() {},
    init() {}
  });

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    const rootNode = codeMirrorUt.current?.view.contentDOM.getRootNode() as
      | Document
      | ShadowRoot;
    const cmScroller = rootNode.querySelector<HTMLDivElement>(
      `#${editorId} .cm-scroller`
    );

    const previewEle = rootNode.querySelector<HTMLElement>(
      `[id="${editorId}-preview-wrapper"]`
    );
    const htmlEle = rootNode.querySelector<HTMLElement>(
      `[id="${editorId}-html-wrapper"]`
    );

    if (previewEle || htmlEle) {
      const scrollHandler = previewEle ? scrollAuto : scrollAutoWithScale;
      const cEle = previewEle || htmlEle;

      const [init, clear] = scrollHandler(cmScroller!, cEle!, codeMirrorUt.current!);

      setScrollCb({
        init,
        clear
      });
    }
  }, [
    html,
    setting.fullscreen,
    setting.pageFullscreen,
    setting.preview,
    setting.htmlPreview,
    editorId,
    codeMirrorUt
  ]);

  useEffect(() => {
    if (
      props.scrollAuto &&
      !setting.previewOnly &&
      (setting.preview || setting.htmlPreview)
    ) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }

    return () => {
      scrollCb.clear();
    };
  }, [
    scrollCb,
    props.scrollAuto,
    setting.preview,
    setting.htmlPreview,
    setting.previewOnly
  ]);
};

export default useAutoScroll;
