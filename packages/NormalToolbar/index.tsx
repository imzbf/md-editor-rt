import { memo, MouseEvent, ReactNode, useMemo } from 'react';
import { prefix } from '~/config';

export interface NormalToolbarProps {
  title?: string;
  children?: ReactNode;
  /**
   * @deprecated 使用children代替
   */
  trigger?: ReactNode;
  onClick: (e: MouseEvent) => void;
  disabled?: boolean;
}

const NormalToolbar = (props: NormalToolbarProps) => {
  const className = useMemo(() => {
    return `${prefix}-toolbar-item${props.disabled ? ' ' + prefix + '-disabled' : ''}`;
  }, [props.disabled]);

  return (
    <button
      className={className}
      title={props.title || ''}
      aria-label={props.title || ''}
      onClick={(e) => {
        if (props.disabled) return;
        props.onClick(e);
      }}
      type="button"
    >
      {props.children || props.trigger}
    </button>
  );
};

export default memo(NormalToolbar);
