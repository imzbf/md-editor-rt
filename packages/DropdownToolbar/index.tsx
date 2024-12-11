import { ReactNode, useContext } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import Dropdown from '~/components/Dropdown';

export interface DropdownToolbarProps {
  title?: string;
  visible: boolean;
  trigger?: ReactNode;
  onChange: (visible: boolean) => void;
  overlay: ReactNode;
  children?: ReactNode;
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
        {props.children || props.trigger}
      </div>
    </Dropdown>
  );
};

export default DropdownToolbar;
