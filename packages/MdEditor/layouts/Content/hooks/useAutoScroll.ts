import { RefObject, useContext, useEffect, useState } from 'react';
import { EditorContext } from '~/Editor';
import scrollAuto, { scrollAutoWithScale } from '~/utils/scroll-auto';
import { ContentProps } from '../props';

import CodeMirrorUt from '../codemirror';

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
  const { editorId } = useContext(EditorContext);
  const [scrollCb, setScrollCb] = useState({
    clear() {},
    init() {}
  });

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    const cmScroller = document.querySelector<HTMLDivElement>(
      `#${editorId} .cm-scroller`
    );

    const previewEle = document.querySelector<HTMLElement>(
      `[id="${editorId}-preview-wrapper"]`
    );
    const htmlEle = document.querySelector<HTMLElement>(
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
    props.setting.fullscreen,
    props.setting.pageFullscreen,
    props.setting.preview,
    props.setting.htmlPreview,
    editorId,
    codeMirrorUt
  ]);

  useEffect(() => {
    if (
      props.scrollAuto &&
      !props.setting.previewOnly &&
      (props.setting.preview || props.setting.htmlPreview)
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
    props.setting.preview,
    props.setting.htmlPreview,
    props.setting.previewOnly
  ]);
};

export default useAutoScroll;
