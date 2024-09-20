import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
  useCallback,
  createContext,
  useRef,
  MutableRefObject
} from 'react';
import bus from '~/utils/event-bus';
import { HeadList, MdHeadingId, Themes } from '~/type';
import { defaultProps, prefix } from '~/config';
import { classnames, getRelativeTop } from '~/utils';
import { CATALOG_CHANGED, PUSH_CATALOG } from '~/static/event-name';

import CatalogLink from './CatalogLink';

export interface TocItem {
  text: string;
  level: number;
  index: number;
  active: boolean;
  children?: Array<TocItem>;
}

export const CatalogContext = createContext<{
  scrollElementRef: MutableRefObject<HTMLElement | undefined> | undefined;
  rootNodeRef: MutableRefObject<Document | ShadowRoot | undefined> | undefined;
}>({
  scrollElementRef: undefined,
  rootNodeRef: undefined
});

export interface CatalogProps {
  /**
   * 编辑器的Id，务必与需要绑定的编辑器Id相同
   */
  editorId: string;
  className?: string;
  mdHeadingId?: MdHeadingId;
  /**
   * 指定滚动的容器，选择器需带上对应的符号，默认预览框
   * 元素必须定位！！！！！！
   *
   * 默认：#md-editor-preview-wrapper
   */
  scrollElement?: string | HTMLElement;
  style?: CSSProperties;
  theme?: Themes;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  /**
   * 高亮标题相对滚动容器顶部偏移量，即距离该值时，高亮当前目录菜单项
   *
   * 默认：20px
   */
  offsetTop?: number;
  /**
   * 滚动区域的固定顶部高度
   *
   * 默认：0
   */
  scrollElementOffsetTop?: number;
  /**
   * 高亮的标题变化事件
   *
   * @param heading
   * @returns
   */
  onActive?: (heading: HeadList | undefined) => void;
  /**
   * 滚动容器是否在web component中，默认不在
   *
   * 在其中的话通过document查询不到
   */
  isScrollElementInShadow?: boolean;
}

const MdCatalog = (props: CatalogProps) => {
  // 获取Id
  const {
    editorId,
    mdHeadingId = defaultProps.mdHeadingId,
    theme = 'light',
    offsetTop = 20
  } = props;
  const defaultScrollElement = useMemo(() => {
    return `#${editorId}-preview-wrapper`;
  }, [editorId]);
  const [list, setList] = useState<Array<HeadList>>([]);

  const [activeItem, setActiveItem] = useState<HeadList>();

  // 目录根部元素
  const catalogRef = useRef<HTMLDivElement>(null);
  // 获取到的滚动root节点
  const scrollElementRef = useRef<HTMLElement>();
  // 滚动容器，包括document
  const scrollContainerRef = useRef<HTMLElement | Document>();
  // 获取到的目录root节点，注意，不支持目录和编辑器不在同一个web c中使用
  const rootNodeRef = useRef<Document | ShadowRoot>();

  // 重构的列表
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    list.forEach((listItem, index) => {
      const { text, level } = listItem;
      const item = {
        level,
        text,
        index: index + 1,
        active: activeItem === listItem
      };

      if (tocItems.length === 0) {
        // 第一个 item 直接 push
        tocItems.push(item);
      } else {
        let lastItem = tocItems[tocItems.length - 1]; // 最后一个 item

        if (item.level > lastItem.level) {
          // item 是 lastItem 的 children
          for (let i = lastItem.level + 1; i <= 6; i++) {
            const { children } = lastItem;
            if (!children) {
              // 如果 children 不存在
              lastItem.children = [item];
              break;
            }

            lastItem = children[children.length - 1]; // 重置 lastItem 为 children 的最后一个 item

            if (item.level <= lastItem.level) {
              // item level 小于或等于 lastItem level 都视为与 children 同级
              children.push(item);
              break;
            }
          }
        } else {
          // 置于最顶级
          tocItems.push(item);
        }
      }
    });

    return tocItems;
  }, [activeItem, list]);

  const [scrollElement] = useState(() => {
    return props.scrollElement || `#${editorId}-preview-wrapper`;
  });

  const getScrollElement = useCallback(() => {
    if (scrollElement instanceof HTMLElement) {
      return scrollElement;
    }

    let scrollRoot: ShadowRoot | Document = document;
    if (scrollElement === defaultScrollElement || props.isScrollElementInShadow) {
      scrollRoot = catalogRef.current?.getRootNode() as ShadowRoot | Document;
    }

    return scrollRoot.querySelector(scrollElement) as HTMLElement;
  }, [defaultScrollElement, props.isScrollElementInShadow, scrollElement]);

  useEffect(() => {
    // 获取当前元素所在的根节点
    rootNodeRef.current = catalogRef.current!.getRootNode() as Document | ShadowRoot;
  }, []);

  useEffect(() => {
    let cacheList: HeadList[] = [];
    const findActiveHeading = (list_: HeadList[]) => {
      if (list_.length === 0) {
        setList([]);
        return false;
      }

      // 获取标记当前位置的目录
      const { activeHead } = list_.reduce(
        (activeData, link, index) => {
          const linkEle = rootNodeRef.current?.getElementById(
            mdHeadingId(link.text, link.level, index + 1)
          );

          if (linkEle instanceof HTMLElement) {
            // 获得当前标题相对滚动容器视窗的高度
            const relativeTop = getRelativeTop(linkEle, scrollElementRef.current!);

            // 当前标题滚动到超出容器的顶部且相比其他的标题最近
            if (relativeTop < offsetTop && relativeTop > activeData.minTop) {
              return {
                activeHead: link,
                minTop: relativeTop
              };
            }
          }

          return activeData;
        },
        {
          activeHead: list_[0],
          minTop: Number.MIN_SAFE_INTEGER
        }
      );

      setActiveItem(activeHead);
      setList(list_);
      cacheList = list_;
    };

    // 滚动区域为document.documentElement需要把监听事件绑定在window上

    const scrollHandler = () => {
      findActiveHeading(cacheList);
    };

    const callback = (_list: Array<HeadList>) => {
      // 切换预览状态后，需要重新获取滚动元素
      const scrollElement = getScrollElement();
      scrollElementRef.current = scrollElement;
      scrollContainerRef.current =
        scrollElement === document.documentElement ? document : scrollElement;

      scrollContainerRef.current?.removeEventListener('scroll', scrollHandler);
      findActiveHeading(_list);
      scrollContainerRef.current?.addEventListener('scroll', scrollHandler);
    };

    bus.on(editorId, {
      name: CATALOG_CHANGED,
      callback
    });

    // 主动触发一次接收
    bus.emit(editorId, PUSH_CATALOG);
    return () => {
      bus.remove(editorId, CATALOG_CHANGED, callback);
      scrollContainerRef.current?.removeEventListener('scroll', scrollHandler);
    };
  }, [offsetTop, mdHeadingId, getScrollElement, editorId]);

  useEffect(() => {
    if (props.onActive) {
      props.onActive(activeItem);
    }
  }, [activeItem, props]);

  return (
    <CatalogContext.Provider
      value={{
        scrollElementRef,
        rootNodeRef
      }}
    >
      <div
        className={classnames([
          `${prefix}-catalog`,
          theme === 'dark' && `${prefix}-catalog-dark`,
          props.className || ''
        ])}
        style={props.style}
        ref={catalogRef}
      >
        {catalogs.map((item) => {
          return (
            <CatalogLink
              mdHeadingId={mdHeadingId}
              tocItem={item}
              key={`${item.text}-${item.index}`}
              onClick={props.onClick}
              scrollElementOffsetTop={props.scrollElementOffsetTop}
            />
          );
        })}
      </div>
    </CatalogContext.Provider>
  );
};

export default React.memo(MdCatalog);
