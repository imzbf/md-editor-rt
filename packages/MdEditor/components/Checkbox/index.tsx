import { prefix } from '~/config';
import { classnames } from '~/utils';

interface CheckBoxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox = (props: CheckBoxProps) => {
  return (
    <div
      className={classnames([
        `${prefix}-checkbox`,
        props.checked && `${prefix}-checkbox-checked`
      ])}
      onClick={() => {
        props.onChange(!props.checked);
      }}
    ></div>
  );
};

export default Checkbox;
