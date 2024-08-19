import React, { MouseEvent, useContext } from 'react';
import { prefix } from '~/config';
import { classnames } from '~/utils';
import { MdHeadingId } from '~/type';
import { getComputedStyleNum } from '~/utils/scroll-auto';

import { CatalogContext, TocItem } from './index';

export interface CatalogLinkProps {
  tocItem: TocItem;
  mdHeadingId: MdHeadingId;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  scrollElementOffsetTop?: number;
}

const CatalogLink = ({
  tocItem,
  mdHeadingId,
  onClick,
  scrollElementOffsetTop = 0
}: CatalogLinkProps) => {
  const { scrollElementRef, rootNodeRef } = useContext(CatalogContext);

  return (
    <div
      className={classnames([
        `${prefix}-catalog-link`,
        tocItem.active && `${prefix}-catalog-active`
      ])}
      onClick={(e) => {
        onClick && onClick(e, tocItem);
        e.stopPropagation();
        const id = mdHeadingId(tocItem.text, tocItem.level, tocItem.index);
        const targetHeadEle = rootNodeRef?.current!.getElementById(id);
        const scrollContainer = scrollElementRef?.current;

        if (targetHeadEle && scrollContainer) {
          let par = targetHeadEle.offsetParent as HTMLElement;
          let offsetTop = targetHeadEle.offsetTop;

          // 滚动容器包含父级offser标准元素
          if (scrollContainer.contains(par)) {
            while (par && scrollContainer != par) {
              // 循环获取当前对象与相对的top高度
              offsetTop += par?.offsetTop;
              par = par?.offsetParent as HTMLElement;
            }
          }

          const pel = targetHeadEle.previousElementSibling;
          let currMarginTop = 0;
          if (!pel) {
            currMarginTop = getComputedStyleNum(targetHeadEle, 'margin-top');
          }

          scrollContainer?.scrollTo({
            top: offsetTop - scrollElementOffsetTop - currMarginTop,
            behavior: 'smooth'
          });
        }
      }}
    >
      <span title={tocItem.text}>{tocItem.text}</span>
      <div className={`${prefix}-catalog-wrapper`}>
        {tocItem.children &&
          tocItem.children.map((item) => (
            <CatalogLink
              mdHeadingId={mdHeadingId}
              key={`${item.text}-${item.index}`}
              tocItem={item}
              onClick={onClick}
              scrollElementOffsetTop={scrollElementOffsetTop}
            />
          ))}
      </div>
    </div>
  );
};

export default CatalogLink;
