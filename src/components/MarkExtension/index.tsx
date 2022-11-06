import React from 'react';
import MdEditor from 'md-editor-rt';

const NormalToolbar = MdEditor.NormalToolbar;

interface MarkExtensionProp {
  editorId: string;
  onChange: (text: string) => void;
}

const MarkExtension = ({ editorId, onChange }: MarkExtensionProp) => {
  const markHandler = () => {
    // 获取输入框
    const textarea = document.querySelector(
      `#${editorId}-textarea`
    ) as HTMLTextAreaElement;
    // 获取选中的内容
    const selection = window.getSelection()?.toString();
    // 获取鼠标位置
    const endPoint = textarea.selectionStart;

    // 生成标记文本
    const markStr = `@${selection}@`;

    // 根据鼠标位置分割旧文本
    // 前半部分
    const prefixStr = textarea.value.substring(0, endPoint);
    // 后半部分
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    onChange(`${prefixStr}${markStr}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, markStr.length + endPoint);
      textarea.focus();
    }, 0);
  };

  return (
    <NormalToolbar
      title="mark"
      onClick={markHandler}
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
    ></NormalToolbar>
  );
};

export default MarkExtension;
