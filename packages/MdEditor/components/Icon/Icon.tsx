import React from 'react';
import { prefix, configOption } from '~/config';

export type IconName =
  | 'bold'
  | 'underline'
  | 'italic'
  | 'strike-through'
  | 'title'
  | 'sub'
  | 'sup'
  | 'quote'
  | 'unordered-list'
  | 'ordered-list'
  | 'task'
  | 'code-row'
  | 'code'
  | 'link'
  | 'image'
  | 'table'
  | 'revoke'
  | 'next'
  | 'baocun'
  | 'prettier'
  | 'suoxiao'
  | 'fangda'
  | 'fullscreen-exit'
  | 'fullscreen'
  | 'preview'
  | 'coding'
  | 'catalog'
  | 'github'
  | 'mermaid'
  | 'formula'
  | 'close'
  | 'delete'
  | 'upload';

const Icon = (props: { name: IconName }) => {
  return configOption.iconfontType === 'svg' ? (
    <svg className={`${prefix}-icon`} aria-hidden="true">
      <use xlinkHref={`#${prefix}-icon-${props.name}`} />
    </svg>
  ) : (
    <i className={`${prefix}-iconfont ${prefix}-icon-${props.name}`} />
  );
};

export default Icon;
