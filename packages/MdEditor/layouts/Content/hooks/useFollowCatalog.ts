import { createSmoothScroll } from '@vavt/util';
import { useCallback, useContext, useRef } from 'react';
import { EditorContext } from '~/context';
import { prefix } from '~~/config';

const smoothScroll = createSmoothScroll();

export const useFollowCatalog = () => {
  const { editorId } = useContext(EditorContext);

  const activeSync = useRef(true);

  const onCatalogActive = useCallback(
    (_toc: unknown, ele: HTMLDivElement) => {
      const scroller = document.querySelector<HTMLElement>(
        `#${editorId} .${prefix}-catalog-editor`
      );

      if (!ele || !activeSync.current || !scroller) {
        return;
      }

      const dis = ele.offsetTop - scroller.scrollTop;
      if (dis > 100) {
        smoothScroll(scroller, ele.offsetTop - 100);
      } else if (dis < 100) {
        smoothScroll(scroller, ele.offsetTop - 100);
      }
    },
    [editorId]
  );

  const onMouseEnter = useCallback(() => (activeSync.current = false), []);

  const onMouseLeave = useCallback(() => (activeSync.current = true), []);

  return {
    onCatalogActive,
    onMouseEnter,
    onMouseLeave
  };
};
