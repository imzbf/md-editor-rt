import React from 'react';
import { prefix } from '../../config';
import { classnames } from '../../utils';
import './style.less';

interface CheckBoxProp {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export default (props: CheckBoxProp) => {
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
