import { MouseEvent, ReactNode } from 'react';
import { prefix } from '~/config';

export interface NormalToolbarProps {
  title?: string;
  children?: ReactNode;
  /**
   * @deprecated 使用children代替
   */
  trigger?: ReactNode;
  onClick: (e: MouseEvent) => void;
}

const NormalToolbar = (props: NormalToolbarProps) => {
  return (
    <div className={`${prefix}-toolbar-item`} title={props.title} onClick={props.onClick}>
      {props.children || props.trigger}
    </div>
  );
};

export default NormalToolbar;
