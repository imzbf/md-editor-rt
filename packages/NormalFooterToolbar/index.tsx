import { memo, MouseEvent, ReactNode } from 'react';
import { prefix } from '~/config';
import { classnames } from '~/utils';

export interface NormalFooterToolbarProps {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
}

const NormalFooterToolbar = (props: NormalFooterToolbarProps) => {
  return (
    <div
      className={classnames([
        `${prefix}-footer-item`,
        props.disabled && `${prefix}-disabled`
      ])}
      onClick={(e) => {
        if (props.disabled) return;
        props.onClick?.(e);
      }}
    >
      {props.children}
    </div>
  );
};

export default memo(NormalFooterToolbar);
