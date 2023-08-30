import { useContext, useEffect } from 'react';
import copy from 'copy-to-clipboard';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { ContentPreviewProps } from '../props';
import StrIcon from '~/components/Icon/Str';

const useCopyCode = (props: ContentPreviewProps, html: string) => {
  const { editorId, usedLanguageText, customIcon } = useContext(EditorContext);
  const { formatCopiedText = (t: string) => t } = props;

  useEffect(() => {
    if (props.setting.preview) {
      // 重新设置复制按钮
      document
        .querySelectorAll(`#${editorId} .${prefix}-preview pre`)
        .forEach((pre: Element) => {
          // 恢复进程ID
          let clearTimer = -1;
          // 移除旧的按钮
          pre.querySelector('.copy-button')?.remove();

          const copyBtnText = usedLanguageText.copyCode?.text || '复制代码';
          const copyButton = document.createElement('span');
          copyButton.setAttribute('class', 'copy-button');
          copyButton.dataset.tips = copyBtnText;

          copyButton.innerHTML = StrIcon('copy', customIcon);

          copyButton.addEventListener('click', () => {
            // 多次点击移除上次的恢复进程
            clearTimeout(clearTimer);

            const codeText = (pre.querySelector('code') as HTMLElement).innerText;

            const success = copy(formatCopiedText(codeText));

            const succssTip = usedLanguageText.copyCode?.successTips || '已复制！';
            const failTip = usedLanguageText.copyCode?.failTips || '已复制！';

            copyButton.dataset.tips = success ? succssTip : failTip;

            clearTimer = window.setTimeout(() => {
              copyButton.dataset.tips = copyBtnText;
            }, 1500);
          });
          pre.appendChild(copyButton);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formatCopiedText,
    html,
    props.setting.preview,
    usedLanguageText.copyCode?.failTips,
    usedLanguageText.copyCode?.successTips,
    usedLanguageText.copyCode?.text
  ]);
};

export default useCopyCode;
