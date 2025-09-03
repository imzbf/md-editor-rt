import React from 'react';
import { NormalToolbar } from '~~/index';
import Icon from '~~/MdEditor/components/Icon';

export default () => {
  return (
    <NormalToolbar
      trigger={<Icon name="strike-through" />}
      onClick={console.log}
      key="dddd"
    ></NormalToolbar>
  );
};
