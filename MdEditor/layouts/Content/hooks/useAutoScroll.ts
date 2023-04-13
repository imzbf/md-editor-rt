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

  // 初始化滚动事件
  useEffect(() => {
    if (!previewOnly && (previewRef.current || htmlRef.current)) {
      const cmScroller = document.querySelector<HTMLDivElement>('.cm-scroller');
      const scrollHandler = previewRef.current ? scrollAuto : scrollAutoWithScale;

      const [init, clear] = scrollHandler(
        cmScroller!,
        previewRef.current! || htmlRef.current,
        codeMirrorUt.current!
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      const cmScroller = document.querySelector<HTMLDivElement>('.cm-scroller');
      const scrollHandler = previewRef.current ? scrollAuto : scrollAutoWithScale;

      // 需要等到页面挂载完成后再注册，否则不能正确获取到预览dom
      const [init, clear] = scrollHandler(
        cmScroller!,
        previewRef.current! || htmlRef.current,
        codeMirrorUt.current!
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    html,
    htmlRef,
    previewRef,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

  // 我们默认，不会发生直接将编辑器切换成预览模式的行为
  // 分栏发生变化时，显示分栏时注册同步滚动，隐藏时清除同步滚动
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }

    return () => {
      scrollCb.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollCb,
    htmlRef,
    previewRef,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);
};

export default useAutoScroll;
