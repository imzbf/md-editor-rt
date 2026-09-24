import copy2clipboard from '@vavt/copy2clipboard';
import { useContext, useEffect, useRef } from 'react';
import { ContentPreviewProps } from '../props';
import { defaultProps, prefix } from '~/config';
import { EditorContext } from '~/context';

const useCopyCode = (props: ContentPreviewProps, html: string, key: string) => {
  const { editorId, usedLanguageText, customIcon, rootRef, setting } =
    useContext(EditorContext);
  const { formatCopiedText = defaultProps.formatCopiedText } = props;
  const formatCopiedTextRef = useRef(formatCopiedText);

  // 按需更新会复用按钮 DOM，点击时读取最新回调，避免旧按钮保留首次绑定的闭包。
  useEffect(() => {
    formatCopiedTextRef.current = formatCopiedText;
  }, [formatCopiedText]);

  useEffect(() => {
    if (setting.preview) {
      // 重新设置复制按钮
      rootRef!.current
        ?.querySelectorAll(`#${editorId} .${prefix}-preview .${prefix}-code`)
        .forEach((codeBlock: Element) => {
          // 恢复进程ID
          let clearTimer = -1;

          const copyButton = codeBlock.querySelector<HTMLSpanElement>(
            `.${prefix}-copy-button:not([data-processed])`
          );

          if (copyButton) {
            copyButton.onclick = (e) => {
              e.preventDefault();
              // 多次点击移除上次的恢复进程
              clearTimeout(clearTimer);

              const activeCode =
                codeBlock.querySelector('input:checked + pre code') ||
                codeBlock.querySelector('pre code');

              const codeText = (activeCode as HTMLElement).textContent || '';
              const { text, successTips, failTips } = usedLanguageText.copyCode!;

              let msg = successTips!;

              copy2clipboard(formatCopiedTextRef.current(codeText))
                .catch(() => {
                  msg = failTips!;
                })
                .finally(() => {
                  if (copyButton.dataset.isIcon) {
                    copyButton.dataset.tips = msg;
                  } else {
                    copyButton.textContent = msg;
                  }

                  clearTimer = window.setTimeout(() => {
                    if (copyButton.dataset.isIcon) {
                      copyButton.dataset.tips = text;
                    } else {
                      copyButton.textContent = text!;
                    }
                  }, 1500);
                });
            };

            copyButton.setAttribute('data-processed', 'true');
          }
        });
    }
  }, [
    customIcon,
    editorId,
    html,
    key,
    setting.preview,
    rootRef,
    usedLanguageText.copyCode
  ]);
};

export default useCopyCode;
