import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import bus from '../../utils/event-bus';
import { HeadList, MarkedHeadingId, Themes } from '../../type';
import CatalogLink from './CatalogLink';
import { defaultProps, prefix } from '../../config';
import './style.less';

export interface TocItem {
  text: string;
  level: number;
  index: number;
  children?: Array<TocItem>;
}

export interface CatalogProps {
  editorId: string;
  className?: string;
  markedHeadingId: MarkedHeadingId;
  // 指定滚动的容器，选择器需带上对应的符号，默认预览框
  // 元素必须定位！！！！！！
  scrollElement?: string | Element;
  style?: CSSProperties;
  theme?: Themes;
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

    list.forEach(({ text, level }, index) => {
      const item = { level, text, index: index + 1 };

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
        setList(_list);
      }
    });

    // 主动触发一次接收
    bus.emit(editorId, 'pushCatalog');
  }, []);

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
          />
        );
      })}
    </div>
  );
};

export default React.memo(MdCatalog);
