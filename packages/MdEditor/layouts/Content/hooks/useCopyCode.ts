import { useContext, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { ContentPreviewProps } from '../props';

const useCopyCode = (props: ContentPreviewProps, html: string, key: string) => {
  const { editorId, usedLanguageText, customIcon } = useContext(EditorContext);
  const { formatCopiedText = (t: string) => t } = props;

  useEffect(() => {
    if (props.setting.preview) {
      // 重新设置复制按钮
      document
        .querySelectorAll(`#${editorId} .${prefix}-preview .${prefix}-code`)
        .forEach((codeBlock: Element) => {
          // 恢复进程ID
          let clearTimer = -1;

          const copyButton = codeBlock.querySelector<HTMLSpanElement>(
            `.${prefix}-copy-button`
          );

          if (copyButton)
            copyButton.onclick = (e) => {
              e.preventDefault();
              // 多次点击移除上次的恢复进程
              clearTimeout(clearTimer);

              const activeCode =
                codeBlock.querySelector('input:checked + pre code') ||
                codeBlock.querySelector('pre code');

              const codeText = (activeCode as HTMLElement).textContent!;

              const success = copy(formatCopiedText(codeText));
              const { text, successTips, failTips } = usedLanguageText.copyCode!;

              const msg = success ? successTips! : failTips!;

              if (copyButton.dataset.isIcon) {
                copyButton.dataset.tips = msg;
              } else {
                copyButton.innerHTML = msg;
              }

              clearTimer = window.setTimeout(() => {
                if (copyButton.dataset.isIcon) {
                  copyButton.dataset.tips = text;
                } else {
                  copyButton.innerHTML = text!;
                }
              }, 1500);
            };
        });
    }
  }, [
    customIcon,
    editorId,
    formatCopiedText,
    html,
    key,
    props.setting.preview,
    usedLanguageText.copyCode
  ]);
};

export default useCopyCode;
