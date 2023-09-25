import React from 'react';
import Icon from '~~/MdEditor/components/Icon';
import { NormalToolbar } from '~~/index';

export default (props: any) => {
  console.log('pr', props);
  return (
    <NormalToolbar
      trigger={<Icon name="strike-through" />}
      onClick={console.log}
      key="dddd"
    ></NormalToolbar>
  );
};
