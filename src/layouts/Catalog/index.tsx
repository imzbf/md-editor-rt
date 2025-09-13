import { createSmoothScroll } from '@vavt/util';
import { MdCatalog } from 'md-editor-rt';
import type { TocItem } from 'md-editor-rt/lib/types/MdCatalog';
import { MouseEvent, useCallback, useRef } from 'react';
import { useAppSelector } from '@/hooks/store';

interface IzCatalogProp {
  editorId: string;
}

const onClick = (e: MouseEvent, t: TocItem) => {
  history.replaceState({}, '', `${location.pathname}#${t.text}`);
};

const IzCatalog = (props: IzCatalogProp) => {
  const state = useAppSelector((state) => state.setting);
  const scrollerRef = useRef<HTMLDivElement>(null);

  const activeSync = useRef(true);

  const onActive = useCallback((toc: unknown, ele: HTMLDivElement) => {
    if (!ele || !activeSync.current) {
      return;
    }

    const smoothScroll = createSmoothScroll();

    const dis = ele.offsetTop - scrollerRef.current!.scrollTop;
    if (dis > 200) {
      smoothScroll(scrollerRef.current!, ele.offsetTop - 200);
    } else if (dis < 100) {
      smoothScroll(scrollerRef.current!, ele.offsetTop - 100);
    }
  }, []);

  return (
    <div
      className="catalog"
      onMouseEnter={() => {
        activeSync.current = false;
      }}
      onMouseLeave={() => {
        activeSync.current = true;
      }}
    >
      <div ref={scrollerRef} className="affix">
        <MdCatalog
          scrollElementOffsetTop={10}
          editorId={props.editorId}
          theme={state.theme}
          scrollElement="html"
          onClick={onClick}
          onActive={onActive}
        />
      </div>
    </div>
  );
};

export default IzCatalog;
