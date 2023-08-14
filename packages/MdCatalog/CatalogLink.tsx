import React, { MouseEvent } from 'react';
import { prefix } from '~/config';
import { classnames } from '~/utils';
import { MdHeadingId } from '~/type';
import { TocItem } from './index';

export interface CatalogLinkProps {
  tocItem: TocItem;
  mdHeadingId: MdHeadingId;
  scrollElement: string | HTMLElement;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  scrollElementOffsetTop?: number;
}

const CatalogLink = ({
  tocItem,
  mdHeadingId,
  scrollElement,
  onClick,
  scrollElementOffsetTop = 0
}: CatalogLinkProps) => {
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
        const targetHeadEle = document.getElementById(id);
        const scrollContainer =
          scrollElement instanceof Element
            ? scrollElement
            : document.querySelector(scrollElement);

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

          scrollContainer?.scrollTo({
            top: offsetTop - scrollElementOffsetTop,
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
              scrollElement={scrollElement}
              onClick={onClick}
              scrollElementOffsetTop={scrollElementOffsetTop}
            />
          ))}
      </div>
    </div>
  );
};

export default CatalogLink;
