import { memo, MouseEvent, useContext, useEffect, useRef } from 'react';
import { prefix } from '~/config';
import { MdHeadingId } from '~/type';
import { classnames } from '~/utils';
import { getComputedStyleNum } from '~/utils/scroll-auto';

import { CatalogContext } from './context';
import { TocItem } from './index';

export interface CatalogLinkProps {
  tocItem: TocItem;
  mdHeadingId: MdHeadingId;
  onActive: (tocItem: TocItem, ele: HTMLDivElement) => void;
  onClick?: (e: MouseEvent, t: TocItem) => void;
  scrollElementOffsetTop?: number;
}

const CatalogLink = ({
  tocItem,
  mdHeadingId,
  onActive,
  onClick,
  scrollElementOffsetTop = 0
}: CatalogLinkProps) => {
  const { scrollElementRef, rootNodeRef } = useContext(CatalogContext);

  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tocItem.active) {
      onActive(tocItem, currRef.current!);
    }
  }, [onActive, tocItem, tocItem.active]);

  return (
    <div
      ref={currRef}
      className={classnames([
        `${prefix}-catalog-link`,
        tocItem.active && `${prefix}-catalog-active`
      ])}
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(e, tocItem);

        if (e.defaultPrevented) {
          return;
        }

        const id = mdHeadingId({
          text: tocItem.text,
          level: tocItem.level,
          index: tocItem.index,
          currentToken: tocItem.currentToken,
          nextToken: tocItem.nextToken
        });
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
      {tocItem.children && tocItem.children.length > 0 && (
        <div className={`${prefix}-catalog-wrapper`}>
          {tocItem.children.map((item) => (
            <CatalogLink
              mdHeadingId={mdHeadingId}
              key={`${tocItem.text}-link-${item.level}-${item.text}`}
              tocItem={item}
              onActive={onActive}
              onClick={onClick}
              scrollElementOffsetTop={scrollElementOffsetTop}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(CatalogLink);
