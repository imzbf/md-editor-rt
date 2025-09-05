import {
  CSSProperties,
  memo,
  MouseEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef
} from 'react';
import { prefix } from '~/config';
import { classnames } from '~/utils';

interface Props {
  id?: string;
  className?: string;
  style?: CSSProperties;
  scrollTarget?: string;
  alwaysShowTrack?: boolean;
  children?: ReactNode;
  onMouseEnter?: MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: MouseEventHandler<HTMLDivElement>;
}

const CustomScrollbar = (props: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const scrollEl = useRef<HTMLElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const isDragging = useRef(false);
  const startY = useRef(0);
  const startScrollTop = useRef(0);

  /** 更新滑块位置和高度 */
  const updateThumb = useCallback(() => {
    if (
      !scrollEl.current ||
      !wrapperRef.current ||
      !thumbRef.current ||
      !trackRef.current
    )
      return;

    const clientH = wrapperRef.current.clientHeight;
    const scrollH = scrollEl.current.scrollHeight;
    const scrollTop = scrollEl.current.scrollTop;

    if (scrollH <= clientH) {
      thumbRef.current.style.display = 'none';
      if (!props.alwaysShowTrack) {
        trackRef.current.style.display = 'none';
      }
      return;
    } else {
      thumbRef.current.style.display = 'block';
      trackRef.current.style.display = 'block';
    }

    const ratio = clientH / scrollH;
    const thumbHeight = Math.max(clientH * ratio, 20);
    const maxTop = clientH - thumbHeight;
    const thumbTop = Math.min(scrollTop * ratio, maxTop);

    thumbRef.current.style.height = `${thumbHeight}px`;
    thumbRef.current.style.top = `${thumbTop}px`;
  }, [props.alwaysShowTrack]);

  const onScroll = updateThumb;

  const onMouseDown = useCallback((e: MouseEvent) => {
    isDragging.current = true;
    startY.current = e.clientY;
    startScrollTop.current = scrollEl.current!.scrollTop;
    document.body.style.userSelect = 'none';
  }, []);

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging.current || !scrollEl.current || !wrapperRef.current) return;
      const deltaY = e.clientY - startY.current;
      const ratio = scrollEl.current.scrollHeight / wrapperRef.current.clientHeight;
      scrollEl.current.scrollTop = startScrollTop.current + deltaY * ratio;
    },
    [startScrollTop, startY]
  );

  const onMouseUp = useCallback(() => {
    isDragging.current = false;
    document.body.style.userSelect = '';
  }, []);

  /** 隐藏原生滚动条 */
  // const hideNativeScrollbar = useCallback((el: HTMLElement) => {
  //   el.classList.add(`${prefix}-custom-scrollbar--hide-native`);
  // }, []);

  /** 绑定滚动元素事件 */
  const bindScrollEl = useCallback(
    (el: HTMLElement | null) => {
      // 解绑旧的
      if (scrollEl.current) {
        scrollEl.current.removeEventListener('scroll', onScroll);
      }

      scrollEl.current = el;

      if (scrollEl.current) {
        // hideNativeScrollbar(scrollEl.current);
        scrollEl.current.addEventListener('scroll', onScroll);
        updateThumb();
      } else {
        // 滚动元素消失时隐藏轨道
        if (trackRef.current && !props.alwaysShowTrack) {
          trackRef.current.style.display = 'none';
        }
      }
    },
    [onScroll, props.alwaysShowTrack, updateThumb]
  );

  /** 查找并绑定最新的滚动元素 */
  const findAndBindScrollEl = useCallback(() => {
    if (!wrapperRef.current) return;
    const el = props.scrollTarget
      ? wrapperRef.current.querySelector<HTMLElement>(props.scrollTarget)
      : (wrapperRef.current.firstElementChild as HTMLElement);
    bindScrollEl(el);
  }, [bindScrollEl, props.scrollTarget]);

  useEffect(() => {
    findAndBindScrollEl();

    const thumbEle = thumbRef.current;

    let bindTimer: number | null = null;

    // 监听 slot 内容变化（防抖）
    const observer = new MutationObserver(() => {
      if (bindTimer) cancelAnimationFrame(bindTimer);
      bindTimer = requestAnimationFrame(() => {
        findAndBindScrollEl();
      });
    });
    observer.observe(wrapperRef.current!, {
      childList: true,
      subtree: true
    });

    window.addEventListener('resize', updateThumb);
    thumbEle?.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      observer?.disconnect();
      if (scrollEl.current) {
        scrollEl.current.removeEventListener('scroll', onScroll);
      }
      window.removeEventListener('resize', updateThumb);
      thumbEle?.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [findAndBindScrollEl, onMouseDown, onMouseMove, onMouseUp, onScroll, updateThumb]);

  return (
    <div
      id={props.id}
      className={classnames([`${prefix}-custom-scrollbar`, props.className])}
      style={props.style}
      ref={wrapperRef}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
    >
      {props.children}
      <div className={`${prefix}-custom-scrollbar__track`} ref={trackRef}>
        <div className={`${prefix}-custom-scrollbar__thumb`} ref={thumbRef}></div>
      </div>
    </div>
  );
};

export default memo(CustomScrollbar);
