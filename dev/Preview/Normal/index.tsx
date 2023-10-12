import React from 'react';
import Icon from '~~/MdEditor/components/Icon';
import { NormalToolbar } from '~~/index';

export default () => {
  return (
    <NormalToolbar
      trigger={<Icon name="strike-through" />}
      onClick={console.log}
      key="dddd"
    ></NormalToolbar>
  );
};
