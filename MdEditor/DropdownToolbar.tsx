import React, { ReactElement } from 'react';
import { prefix } from './config';
import Dropdown from './components/Dropdown';

export interface DropdownToolbarProp {
  title?: string;
  visible: boolean;
  trigger: string | ReactElement;
  onChange: (visible: boolean) => void;
  overlay: string | ReactElement;
}

const DropdownToolbar = (props: DropdownToolbarProp) => {
  return (
    <Dropdown visible={props.visible} onChange={props.onChange} overlay={props.overlay}>
      <div className={`${prefix}-toolbar-item`} title={props.title || ''}>
        {props.trigger}
      </div>
    </Dropdown>
  );
};

export default DropdownToolbar;
