import React, { useContext } from 'react';
import Icon, { IconName } from './Icon';
import { EditorContext } from '~/Editor';

export default (props: { name: IconName }) => {
  const { customIcon } = useContext(EditorContext);

  const item = customIcon[props.name];

  // 自定义的图标总是对象结构，唯一的copy图标只会通过Str判断内容
  if (typeof item === 'object') {
    const CusIcon = item.component;

    // 无论是class组件还是函数组件，都是function类型
    return typeof CusIcon === 'function' ? (
      <CusIcon {...item.props} />
    ) : (
      <span
        dangerouslySetInnerHTML={{
          __html: item.component as string
        }}
      ></span>
    );
  }

  return <Icon name={props.name} />;
};
