import { RefObject, useContext, useEffect, useRef } from 'react';
import bus from '~/utils/event-bus';
import { EditorContext } from '~/Editor';
// import { directive2flag, ToolDirective } from '~/utils/content-help';
import { ContentProps } from '../props';

/**
 * 处理输入框中的一些交互事件，例如：列表回车生成一个新的空行列表等
 *
 * @param props ContentProps
 * @param textAreaRef 输入框
 */
const useAutoGenrator = (
  props: ContentProps,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const selectedText = useRef('');
  const { previewOnly, tabWidth, editorId } = useContext(EditorContext);

  useEffect(() => {
    // const textAreaOnKeypress = (event: any) => {
    //   if (event.key === 'Enter') {
    //     const endPoint = textAreaRef.current?.selectionStart as number;
    //     // 前半部分
    //     const prefixStr = textAreaRef.current?.value.substring(0, endPoint);
    //     // 后半部分
    //     const subStr = textAreaRef.current?.value.substring(endPoint);
    //     // 前半部分最后一个换行符位置，用于分割当前行内容
    //     const lastIndexBR = prefixStr?.lastIndexOf('\n');
    //     const enterPressRow = prefixStr?.substring(
    //       (lastIndexBR as number) + 1,
    //       endPoint
    //     ) as string;
    //     // 是列表
    //     if (/^\d+\.\s|^-\s/.test(enterPressRow)) {
    //       event.cancelBubble = true;
    //       event.preventDefault();
    //       event.stopPropagation();
    //       // 如果列表当前行没有内容，则清空当前行
    //       // '- ', '- [ ] ', '- [x] '，-同数字
    //       if (/^(\d+\.|-)\s+(\[[x\s]\]\s+)?$/.test(enterPressRow)) {
    //         const resetPrefixStr = prefixStr?.replace(/(\d+\.|-)\s+(\[[x\s]\]\s+)?$/, '');
    //         props.onChange((resetPrefixStr as string) + subStr);
    //         // 手动定位光标到当前位置
    //         setPosition(
    //           textAreaRef.current as HTMLTextAreaElement,
    //           resetPrefixStr?.length
    //         );
    //       } else if (/^-\s+.+/.test(enterPressRow)) {
    //         const newLine = /^-\s+\[[x\s]\]/.test(enterPressRow) ? '\n- [ ] ' : '\n- ';
    //         // 无序列表存在内容
    //         props.onChange(
    //           insert(textAreaRef.current as HTMLTextAreaElement, newLine, {})
    //         );
    //       } else {
    //         const lastOrderMatch = enterPressRow?.match(/\d+(?=\.)/);
    //         const nextOrder = (lastOrderMatch && Number(lastOrderMatch[0]) + 1) || 1;
    //         const newLine = /^\d\.\s+\[[x\s]\]/.test(enterPressRow)
    //           ? `\n${nextOrder}. [ ] `
    //           : `\n${nextOrder}. `;
    //         props.onChange(
    //           insert(textAreaRef.current as HTMLTextAreaElement, newLine, {})
    //         );
    //       }
    //     }
    //   }
    // };
    // const onSelectedTextChangd = () => {
    //   selectedText.current = getSelectionText(textAreaRef.current as HTMLTextAreaElement);
    // };
    // if (!previewOnly) {
    //   textAreaRef.current?.addEventListener('keypress', textAreaOnKeypress);
    //   // 注册修改选择内容事件
    //   bus.on(editorId, {
    //     name: 'selectTextChange',
    //     callback: onSelectedTextChangd
    //   });
    // }
    // return () => {
    //   if (!previewOnly) {
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    //     textAreaRef.current?.removeEventListener('keypress', textAreaOnKeypress);
    //     bus.remove(editorId, 'selectTextChange', onSelectedTextChangd);
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onChange]);

  useEffect(() => {
    // const replaceCallBack = (direct: ToolDirective, params = {}) => {
    //   props.onChange(
    //     directive2flag(
    //       direct,
    //       selectedText.current,
    //       textAreaRef.current as HTMLTextAreaElement,
    //       {
    //         ...params,
    //         tabWidth,
    //         editorId
    //       }
    //     )
    //   );
    // };
    // if (!previewOnly) {
    //   // 注册指令替换内容事件
    //   bus.on(editorId, {
    //     name: 'replace',
    //     callback: replaceCallBack
    //   });
    // }
    // return () => {
    //   if (!previewOnly) {
    //     bus.remove(editorId, 'replace', replaceCallBack);
    //   }
    // };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onChange, tabWidth, textAreaRef]);

  return {
    selectedText
  };
};

export default useAutoGenrator;
