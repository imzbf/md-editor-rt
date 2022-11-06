import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';

import { emojis } from './data';

const DropdownToolbar = MdEditor.DropdownToolbar;

interface EmojiExtensionProp {
  editorId: string;
  onChange: (v: string) => void;
}

const EmojiExtension = (props: EmojiExtensionProp) => {
  const [state, setState] = useState({
    visible: false
  });

  const emojiHandler = (emoji: string) => {
    // 获取输入框
    const textarea = document.querySelector(
      `#${props.editorId}-textarea`
    ) as HTMLTextAreaElement;
    // 获取选中的内容
    const selection = window.getSelection()?.toString();
    // 获取鼠标位置
    const endPoint = textarea.selectionStart;

    // 根据鼠标位置分割旧文本
    // 前半部分
    const prefixStr = textarea.value.substring(0, endPoint);
    // 后半部分
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    props.onChange(`${prefixStr}${emoji}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, endPoint + 1);
      textarea.focus();
    }, 0);
  };

  const onChange = (visible: boolean) => {
    setState({
      visible
    });
  };

  return (
    <DropdownToolbar
      title="emoji"
      visible={state.visible}
      onChange={onChange}
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      }
      overlay={
        <div className="emoji-container">
          <ol className="emojis">
            {emojis.map((emoji, index) => {
              return (
                <li
                  key={`emoji-${index}`}
                  onClick={() => {
                    emojiHandler(emoji);
                  }}
                >
                  {emoji}
                </li>
              );
            })}
          </ol>
        </div>
      }
    ></DropdownToolbar>
  );
};

export default EmojiExtension;
