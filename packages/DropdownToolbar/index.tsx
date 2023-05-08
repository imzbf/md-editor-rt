import React, { ReactElement, useContext } from 'react';
import { prefix } from '~/config';
import Dropdown from '~/components/Dropdown';
import { EditorContext } from '~/Editor';

export interface DropdownToolbarProps {
  title?: string;
  visible: boolean;
  trigger: string | ReactElement;
  onChange: (visible: boolean) => void;
  overlay: string | ReactElement;
}

const DropdownToolbar = (props: DropdownToolbarProps) => {
  const { editorId } = useContext(EditorContext);

  return (
    <Dropdown
      relative={`#${editorId}-toolbar-wrapper`}
      visible={props.visible}
      onChange={props.onChange}
      overlay={props.overlay}
    >
      <div className={`${prefix}-toolbar-item`} title={props.title || ''}>
        {props.trigger}
      </div>
    </Dropdown>
  );
};

export default DropdownToolbar;
