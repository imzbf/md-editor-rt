import { MouseEvent, ReactNode, useMemo } from 'react';
import { prefix } from '~/config';

export interface NormalFooterToolbarProps {
  children: ReactNode;
  onClick?: (e: MouseEvent) => void;
  disabled?: boolean;
}

const NormalFooterToolbar = (props: NormalFooterToolbarProps) => {
  const className = useMemo(() => {
    return `${prefix}-footer-item${props.disabled ? ' ' + prefix + '-disabled' : ''}`;
  }, [props.disabled]);

  return (
    <div
      className={className}
      onClick={(e) => {
        if (props.disabled) return;
        props.onClick?.(e);
      }}
    >
      {props.children}
    </div>
  );
};

export default NormalFooterToolbar;
