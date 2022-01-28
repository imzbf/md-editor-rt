import { prefix } from '../../config';
import React from 'react';
import { TocItem } from './index';
import { MarkedHeadingId } from '../../type';

export interface CatalogLinkProps {
  tocItem: TocItem;
  markedHeadingId: MarkedHeadingId;
}

const CatalogLink = (props: CatalogLinkProps) => {
  return (
    <div
      className={`${prefix}-catalog-link`}
      onClick={(e) => {
        e.stopPropagation();
        const id = props.markedHeadingId(props.tocItem.text, props.tocItem.level);
        const targetHeadEle = document.getElementById(id);
        const previewEle = document.getElementById(`${prefix}-preview`);

        if (targetHeadEle) {
          const scrollLength = targetHeadEle.offsetTop;

          previewEle?.parentElement?.scrollTo({
            top: scrollLength,
            behavior: 'smooth'
          });
        }
      }}
    >
      <span>{props.tocItem.text}</span>
      {props.tocItem.children &&
        props.tocItem.children.map((item) => (
          <CatalogLink
            markedHeadingId={props.markedHeadingId}
            key={item.text}
            tocItem={item}
          />
        ))}
    </div>
  );
};

export default CatalogLink;
