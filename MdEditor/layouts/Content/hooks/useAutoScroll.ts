import { RefObject, useContext, useEffect, useState } from 'react';
import copy from 'copy-to-clipboard';
import { prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { scrollAuto } from '~/utils';
import { ContentProps } from '../props';

/**
 * 自动滚动
 * @param props
 * @param html
 * @param textAreaRef
 * @param previewRef
 * @param htmlRef
 */
const useAutoScroll = (
  props: ContentProps,
  html: string,
  inputWrapper: RefObject<HTMLElement> | string,
  previewRef: RefObject<HTMLElement>,
  htmlRef: RefObject<HTMLElement>
) => {
  const { previewOnly, editorId, usedLanguageText } = useContext(EditorContext);
  const { formatCopiedText = (t: string) => t } = props;
  const [scrollCb, setScrollCb] = useState({
    clear() {},
    init() {}
  });

  // 初始化滚动事件
  useEffect(() => {
    if (!previewOnly && (previewRef.current || htmlRef.current)) {
      const inputWrapperElement =
        typeof inputWrapper === 'string'
          ? document.querySelector(inputWrapper)
          : inputWrapper.current;

      const [init, clear] = scrollAuto(
        inputWrapperElement as HTMLElement,
        (previewRef.current as HTMLElement) || htmlRef.current
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      const inputWrapperElement =
        typeof inputWrapper === 'string'
          ? document.querySelector(inputWrapper)
          : inputWrapper.current;
      // 需要等到页面挂载完成后再注册，否则不能正确获取到预览dom
      const [init, clear] = scrollAuto(
        inputWrapperElement as HTMLElement,
        (previewRef.current as HTMLElement) || (htmlRef.current as HTMLElement)
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    html,
    htmlRef,
    previewRef,
    inputWrapper,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

  // 我们默认，不会发生直接将编辑器切换成预览模式的行为
  // 分栏发生变化时，显示分栏时注册同步滚动，隐藏时清除同步滚动
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }

    return () => {
      scrollCb.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollCb,
    htmlRef,
    previewRef,
    inputWrapper,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

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

          copyButton.innerHTML = `<svg class="${prefix}-icon" aria-hidden="true"><use xlink:href="#${prefix}-icon-copy"></use></svg>`;

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

export default useAutoScroll;
