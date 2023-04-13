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
  html: RefObject<string>,
  previewRef: RefObject<HTMLElement>,
  htmlRef: RefObject<HTMLElement>,
  codeMirrorUt: RefObject<CodeMirrorUt | undefined>
) => {
  const { previewOnly } = useContext(EditorContext);
  const [scrollCb, setScrollCb] = useState({
    clear() {},
    init() {}
  });

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    scrollCb.clear();
    const cmScroller = document.querySelector<HTMLDivElement>('.cm-scroller');

    if (!previewOnly && (previewRef.current || htmlRef.current)) {
      const scrollHandler = previewRef.current ? scrollAuto : scrollAutoWithScale;

      const [init, clear] = scrollHandler(
        cmScroller!,
        previewRef.current! || htmlRef.current,
        codeMirrorUt.current!,
        props.value
      );

      setScrollCb({
        init,
        clear
      });

      if (props.scrollAuto) {
        init();
      }
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
