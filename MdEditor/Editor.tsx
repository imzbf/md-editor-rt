import React from 'react';
import cn from 'classnames';

declare global {
  interface Window {
    hljs: any;
    prettier: any;
    prettierPlugins: any;
    Cropper: any;
  }
}

export interface Props {
  modelValue: string;
  // 主题，支持light和dark
  theme?: 'light' | 'dark';
  // 外层扩展类名
  editorClass?: string;
}

export const prefix = 'md';

const Editor = (props: Props) => {
  return (
    <div
      className={cn([
        prefix,
        props.editorClass,
        props.theme === 'dark' && `${prefix}-dark`
      ])}
    >
      编辑器
    </div>
  );
};

Editor.defaultProps = {
  modelValue: '',
  theme: 'light',
  editorClass: ''
} as Props;

export default Editor;
