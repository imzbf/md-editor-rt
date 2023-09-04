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
    scrollCb.clear();
    const cmScroller = document.querySelector<HTMLDivElement>(
      `#${editorId} .cm-scroller`
    );

    const previewEle = document.querySelector<HTMLElement>(
      `[id="${editorId}-preview-wrapper"][data-show="true"]`
    );
    const htmlEle = document.querySelector<HTMLElement>(
      `[id="${editorId}-html-wrapper"][data-show="true"]`
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    html,
    props.setting.fullscreen,
    props.setting.pageFullscreen,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

  useEffect(() => {
    if (props.scrollAuto) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }

    return () => {
      scrollCb.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollCb, props.scrollAuto]);
};

export default useAutoScroll;
