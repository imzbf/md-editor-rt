import { useCallback } from 'react';
import { prefix } from '~/config';
import { classnames } from '~/utils';

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const Checkbox = (props: CheckBoxProps) => {
  const handleClick = useCallback(() => {
    if (!props.disabled) {
      props.onChange(!props.checked);
    }
  }, [props]);

  return (
    <div
      className={classnames([
        `${prefix}-checkbox`,
        props.checked && `${prefix}-checkbox-checked`,
        props.disabled && `${prefix}-disabled`
      ])}
      onClick={handleClick}
    />
  );
};

export default Checkbox;
