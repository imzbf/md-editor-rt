import { ReactNode, useContext, useMemo } from 'react';
import Dropdown from '~/components/Dropdown';
import { prefix } from '~/config';
import { EditorContext } from '~/context';

export interface DropdownToolbarProps {
  title?: string;
  visible: boolean;
  /**
   * @deprecated 使用children代替
   */
  trigger?: ReactNode;
  onChange: (visible: boolean) => void;
  overlay: ReactNode;
  children?: ReactNode;
  disabled?: boolean;
}

const DropdownToolbar = (props: DropdownToolbarProps) => {
  const { editorId } = useContext(EditorContext);
  const className = useMemo(() => {
    return `${prefix}-toolbar-item${props.disabled ? ' ' + prefix + '-disabled' : ''}`;
  }, [props.disabled]);

  return (
    <Dropdown
      relative={`#${editorId}-toolbar-wrapper`}
      visible={props.visible}
      onChange={props.onChange}
      overlay={props.overlay}
      disabled={props.disabled}
    >
      <button
        className={className}
        title={props.title || ''}
        disabled={props.disabled}
        type="button"
      >
        {props.children || props.trigger}
      </button>
    </Dropdown>
  );
};

export default DropdownToolbar;
