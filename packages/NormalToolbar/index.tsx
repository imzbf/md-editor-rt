import React, { MouseEvent, ReactElement } from 'react';
import { prefix } from '~/config';

export interface NormalToolbarProps {
  title?: string;
  trigger: string | ReactElement;
  onClick: (e: MouseEvent) => void;
}

const NormalToolbar = (props: NormalToolbarProps) => {
  return (
    <div className={`${prefix}-toolbar-item`} title={props.title} onClick={props.onClick}>
      {props.trigger}
    </div>
  );
};

export default NormalToolbar;
