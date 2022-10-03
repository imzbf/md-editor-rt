import React, { CSSProperties, useEffect, useMemo, useState, MouseEvent } from 'react';
import bus from '../../utils/event-bus';
import { HeadList, MarkedHeadingId, Themes } from '../../type';
import CatalogLink from './CatalogLink';
import { defaultProps, prefix } from '../../config';
import { throttle, getRelativeTop } from '../../utils';
import './style.less';

export interface TocItem {
  text: string;
  level: number;
  index: number;
  active: boolean;
  children?: Array<TocItem>;
}

export interface CatalogProps {
  editorId: string;
  className?: string;
  markedHeadingId?: MarkedHeadingId;
  // 指定滚动的容器，选择器需带上对应的符号，默认预览框
  // 元素必须定位！！！！！！
  scrollElement?: string | HTMLElement;
  style?: CSSProperties;
  theme?: Themes;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  // 偏移量，默认20像素
  offsetTop?: number;
}

const MdCatalog = (props: CatalogProps) => {
  // 获取Id
  const {
    editorId,
    markedHeadingId = defaultProps.markedHeadingId,
    theme = 'light'
  } = props;

  const [list, setList] = useState<Array<HeadList>>([]);

  // 重构的列表
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    list.forEach(({ text, level, active }, index) => {
      const item = { level, text, index: index + 1, active: !!active };

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
  }, [list]);

  const [scrollElement] = useState(() => {
    return props.scrollElement || `#${editorId}-preview-wrapper`;
  });

  useEffect(() => {
    bus.on(editorId, {
      name: 'catalogChanged',
      callback: (_list: Array<HeadList>) => {
        setList(
          _list.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                active: true
              };
            }

            return {
              ...item
            };
          })
        );
      }
    });

    // 主动触发一次接收
    bus.emit(editorId, 'pushCatalog');
  }, []);

  useEffect(() => {
    const _scrollElement =
      scrollElement instanceof HTMLElement
        ? scrollElement
        : (document.querySelector(scrollElement) as HTMLElement);

    const scrollHandler = throttle(() => {
      if (list.length === 0) {
        return false;
      }

      // 获取标记当前位置的目录
      const { activeHead } = list.reduce(
        (activeData, link, index) => {
          const linkEle = document.getElementById(
            markedHeadingId(link.text, link.level, index + 1)
          );

          if (linkEle instanceof HTMLElement) {
            // 获得当前标题相对滚动容器视窗的高度
            const relativeTop = getRelativeTop(linkEle, _scrollElement);

            // 当前标题滚动到超出容器的顶部且相比其他的标题最近
            if (
              relativeTop < (props.offsetTop || 20) &&
              relativeTop > activeData.minTop
            ) {
              return {
                activeHead: link,
                minTop: relativeTop
              };
            }
          }

          return activeData;
        },
        {
          activeHead: list[0],
          minTop: Number.MIN_SAFE_INTEGER
        }
      );

      setList(
        list.map((item) => {
          if (item === activeHead) {
            return {
              ...item,
              active: true
            };
          }

          return {
            ...item,
            active: false
          };
        })
      );
    });

    // 滚动区域为document.documentElement需要把监听事件绑定在window上
    const scrollContainer =
      _scrollElement === document.documentElement ? window : _scrollElement;

    scrollContainer?.addEventListener('scroll', scrollHandler);
    return () => {
      scrollContainer?.removeEventListener('scroll', scrollHandler);
    };
  }, [props.offsetTop, list, markedHeadingId]);

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
            markedHeadingId={markedHeadingId}
            tocItem={item}
            key={item.text}
            scrollElement={scrollElement}
            onClick={props.onClick}
          />
        );
      })}
    </div>
  );
};

export default React.memo(MdCatalog);
