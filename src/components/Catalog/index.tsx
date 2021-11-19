import React, { ReactElement, useMemo } from 'react';
import { Anchor } from 'antd';
import './style.less';
import CatalogLink from './CatalogLink';

export interface TocItem {
  text: string;
  level: number;
  children?: Array<TocItem>;
}

const Catalog = ({ heads }: { heads: Array<any> }): ReactElement => {
  // 重构的列表
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    heads.forEach(({ text, level }) => {
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
  }, [heads]);

  return (
    <Anchor affix={false} showInkInFixed={false}>
      {catalogs.map((item) => (
        <CatalogLink key={`${item.level}-${item.text}`} tocItem={item} />
      ))}
    </Anchor>
  );
};

export default Catalog;
