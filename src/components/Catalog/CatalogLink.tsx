import React, { ReactElement } from 'react';
import { Anchor } from 'antd';
import { TocItem } from './';

const { Link } = Anchor;

interface RecursiveProps {
  tocItem: TocItem;
}

const Recursive = ({ tocItem }: RecursiveProps): ReactElement => {
  return (
    <Link href={`#${tocItem.text}`} title={tocItem.text}>
      {tocItem.children &&
        tocItem.children.map((item) => (
          <Recursive key={`${item.level}-${item.text}`} tocItem={item} />
        ))}
    </Link>
  );
};

export default Recursive;
