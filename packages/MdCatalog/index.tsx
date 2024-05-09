import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useState,
  MouseEvent,
  useCallback
} from 'react';
import bus from '~/utils/event-bus';
import { HeadList, MdHeadingId, Themes } from '~/type';
import { defaultProps, prefix } from '~/config';
import { getRelativeTop } from '~/utils';
import { CATALOG_CHANGED, PUSH_CATALOG } from '~/static/event-name';

import CatalogLink from './CatalogLink';

export interface TocItem {
  text: string;
  level: number;
  index: number;
  active: boolean;
  children?: Array<TocItem>;
}

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
}

const MdCatalog = (props: CatalogProps) => {
  // 获取Id
  const {
    editorId,
    mdHeadingId = defaultProps.mdHeadingId,
    theme = 'light',
    offsetTop = 20
  } = props;

  const [list, setList] = useState<Array<HeadList>>([]);

  const [activeItem, setActiveItem] = useState<HeadList>();

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
    const scrollElement_ =
      scrollElement instanceof HTMLElement
        ? scrollElement
        : (document.querySelector(scrollElement) as HTMLElement);

    return scrollElement_;
  }, [scrollElement]);

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
          const linkEle = document.getElementById(
            mdHeadingId(link.text, link.level, index + 1)
          );

          if (linkEle instanceof HTMLElement) {
            const scrollElement = getScrollElement();
            // 获得当前标题相对滚动容器视窗的高度
            const relativeTop = getRelativeTop(linkEle, scrollElement);

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
    let scrollContainer: HTMLElement | Window = window;

    const findScrollContainer = () => {
      const scrollElement_ = getScrollElement();

      scrollContainer =
        scrollElement_ === document.documentElement ? window : scrollElement_;
    };

    const scrollHandler = () => {
      findActiveHeading(cacheList);
    };

    const callback = (_list: Array<HeadList>) => {
      scrollContainer?.removeEventListener('scroll', scrollHandler);
      findActiveHeading(_list);
      findScrollContainer();
      scrollContainer?.addEventListener('scroll', scrollHandler);
    };

    bus.on(editorId, {
      name: CATALOG_CHANGED,
      callback
    });

    // 主动触发一次接收
    bus.emit(editorId, PUSH_CATALOG);

    findScrollContainer();

    scrollContainer?.addEventListener('scroll', scrollHandler);
    return () => {
      bus.remove(editorId, CATALOG_CHANGED, callback);
      scrollContainer?.removeEventListener('scroll', scrollHandler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offsetTop, mdHeadingId, getScrollElement]);

  useEffect(() => {
    if (props.onActive) {
      props.onActive(activeItem);
    }
  }, [activeItem, props]);

  return (
    <div
      className={`${prefix}-catalog${theme === 'dark' ? '-dark' : ''} ${
        props.className || ''
      } `}
      style={props.style}
    >
      {catalogs.map((item) => {
        return (
          <CatalogLink
            mdHeadingId={mdHeadingId}
            tocItem={item}
            key={`${item.text}-${item.index}`}
            scrollElement={scrollElement}
            onClick={props.onClick}
            scrollElementOffsetTop={props.scrollElementOffsetTop}
          />
        );
      })}
    </div>
  );
};

export default React.memo(MdCatalog);
