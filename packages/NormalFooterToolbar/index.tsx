import { MouseEvent, ReactNode } from 'react';
import { prefix } from '~/config';

export interface NormalFooterToolbarProps {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
}

const NormalFooterToolbar = (props: NormalFooterToolbarProps) => {
  return (
    <div className={`${prefix}-footer-item`} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default NormalFooterToolbar;
