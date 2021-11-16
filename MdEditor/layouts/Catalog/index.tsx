import React, { useContext, useEffect, useMemo, useState } from 'react';
import './style.less';
import bus from '../../utils/event-bus';
import { EditorContext, HeadList, MarkedHeadingId } from '../../Editor';
import CatalogLink from './CatalogLink';
import { prefix } from '../../config';

export interface TocItem {
  text: string;
  level: number;
  children?: Array<TocItem>;
}

export interface CatalogProps {
  markedHeadingId: MarkedHeadingId;
}

const Catalog = (props: CatalogProps) => {
  const { editorId } = useContext(EditorContext);

  const [list, setList] = useState<Array<HeadList>>([]);

  // 重构的列表
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    list.forEach(({ text, level }) => {
      const item = { level, text };

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

  const [show, setShow] = useState(false);

  useEffect(() => {
    bus.on(editorId, {
      name: 'catalogChanged',
      callback: (_list: Array<HeadList>) => {
        setList(_list);
      }
    });

    bus.on(editorId, {
      name: 'catalogShow',
      callback: () => {
        setShow((_val) => {
          return !_val;
        });
      }
    });
  }, []);

  return show ? (
    <div className={`${prefix}-catalog`}>
      {catalogs.map((item) => {
        return (
          <CatalogLink
            markedHeadingId={props.markedHeadingId}
            tocItem={item}
            key={item.text}
          />
        );
      })}
    </div>
  ) : null;
};

export default Catalog;
