import React, { ReactElement } from 'react';
import { Anchor } from 'antd';
import { TocItem } from './';

const { Link } = Anchor;

interface CatalogLinkProps {
  tocItem: TocItem;
}

const CatalogLink = ({ tocItem }: CatalogLinkProps): ReactElement => {
  return (
    <Link href={`#${tocItem.text}`} title={tocItem.text}>
      {tocItem.children && (
        <div className="catalog-container">
          {tocItem.children.map((item) => (
            <CatalogLink key={`${item.level}-${item.text}`} tocItem={item} />
          ))}
        </div>
      )}
    </Link>
  );
};

export default CatalogLink;
