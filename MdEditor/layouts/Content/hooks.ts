import { insert, setPosition } from '../../utils';
import { directive2flag, ToolDirective } from '../../utils/content-help';
import { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import bus from '../../utils/event-bus';
import { EditorContentProp } from './';
import { EditorContext } from '../../Editor';
import { marked } from 'marked';

import mermaid from 'mermaid';

interface HistoryItemType {
  // 记录内容
  content: string;
  // 本次记录鼠标选择内容开始位置
  startPos: number;
  // 结束位置
  endPos: number;
}

interface HistoryDataType {
  // 历史记录列表
  list: Array<HistoryItemType>;
  // 是否是手动输入而非撤回
  userUpdated: boolean;
  // 当前记录位置
  curr: number;
}

// 防抖ID
let saveHistoryId = -1;

export const useHistory = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const { onChange } = props;
  const { historyLength, editorId } = useContext(EditorContext);

  const [history, setHistory] = useState<HistoryDataType>({
    list: [],
    userUpdated: true,
    curr: 0
  });

  useEffect(() => {
    clearTimeout(saveHistoryId);
    const startPos: number = textAreaRef.current?.selectionStart || 0;
    const endPos: number = textAreaRef.current?.selectionEnd || 0;

    saveHistoryId = window.setTimeout(() => {
      // 如果不是撤销操作，就记录
      if (history.userUpdated) {
        // 重置撤回之前的记录
        if (history.curr < history.list.length - 1) {
          history.list = history.list.slice(0, history.curr + 1);
        }
        if (history.list.length > historyLength) {
          history.list.shift();
        }

        // 修改保存上次记录选中定位
        const lastStep = history.list.pop() || {
          startPos: 0,
          endPos: 0,
          content: props.value
        };
        lastStep.startPos = startPos;
        lastStep.endPos = endPos;

        Array.prototype.push.call(history.list, lastStep, {
          content: props.value,
          startPos,
          endPos
        });

        // 下标调整为最后一个位置
        history.curr = history.list.length - 1;
      } else {
        setHistory({
          ...history,
          userUpdated: true
        });
      }
    }, 10);
  }, [props.value]);

  useEffect(() => {
    bus.on(editorId, {
      name: 'ctrlZ',
      callback() {
        setHistory({
          ...history,
          userUpdated: false
        });
        // 倒退一个下标，最多倒退到0
        history.curr = history.curr - 1 < 0 ? 0 : history.curr - 1;

        const currHistory = history.list[history.curr];

        onChange(currHistory.content);
        // 选中内容
        setPosition(
          textAreaRef.current as HTMLTextAreaElement,
          currHistory.startPos,
          currHistory.endPos
        );
      }
    });

    bus.on(editorId, {
      name: 'ctrlShiftZ',
      callback() {
        setHistory({
          ...history,
          userUpdated: false
        });
        // 前进一个下标，最多倒退到最大下标
        history.curr =
          history.curr + 1 === history.list.length ? history.curr : history.curr + 1;

        const currHistory = history.list[history.curr];
        onChange(currHistory.content);

        // 选中内容
        setPosition(
          textAreaRef.current as HTMLTextAreaElement,
          currHistory.startPos,
          currHistory.endPos
        );
      }
    });
  }, []);
};

export const useAutoGenrator = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const selectedText = useRef('');
  const { previewOnly, tabWidth, editorId } = useContext(EditorContext);

  useEffect(() => {
    if (!previewOnly) {
      textAreaRef.current?.addEventListener('select', () => {
        selectedText.current = window.getSelection()?.toString() || '';
      });

      textAreaRef.current?.addEventListener('keypress', (event: any) => {
        if (event.key === 'Enter') {
          const endPoint = textAreaRef.current?.selectionStart as number;

          // 前半部分
          const prefixStr = textAreaRef.current?.value.substring(0, endPoint);
          // 后半部分
          const subStr = textAreaRef.current?.value.substring(endPoint);
          // 前半部分最后一个换行符位置，用于分割当前行内容
          const lastIndexBR = prefixStr?.lastIndexOf('\n');

          const enterPressRow = prefixStr?.substring(
            (lastIndexBR as number) + 1,
            endPoint
          ) as string;

          // 是列表
          if (/^\d+\.\s|^-\s/.test(enterPressRow)) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();

            // 如果列表当前行没有内容，则清空当前行
            if (/^\d+\.\s+$|^-\s+$/.test(enterPressRow)) {
              const resetPrefixStr = prefixStr?.replace(
                new RegExp(enterPressRow + '$'),
                ''
              );
              props.onChange((resetPrefixStr as string) + subStr);

              // 手动定位光标到当前位置
              setPosition(
                textAreaRef.current as HTMLTextAreaElement,
                resetPrefixStr?.length
              );
            } else if (/^-\s+.+/.test(enterPressRow)) {
              // 无序列表存在内容
              props.onChange(
                insert(textAreaRef.current as HTMLTextAreaElement, '\n- ', {})
              );
            } else {
              const lastOrderMatch = enterPressRow?.match(/\d+(?=\.)/);

              const nextOrder = (lastOrderMatch && Number(lastOrderMatch[0]) + 1) || 1;
              props.onChange(
                insert(textAreaRef.current as HTMLTextAreaElement, `\n${nextOrder}. `, {})
              );
            }
          }
        }
      });

      // 注册修改选择内容事件
      bus.on(editorId, {
        name: 'selectTextChange',
        callback(val: string) {
          selectedText.current = val;
        }
      });
    }
  }, []);

  const replaceCallBack = useCallback(
    (direct: ToolDirective, params = {}) => {
      props.onChange(
        directive2flag(
          direct,
          selectedText.current,
          textAreaRef.current as HTMLTextAreaElement,
          {
            ...params,
            tabWidth
          }
        )
      );
    },
    [textAreaRef]
  );

  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, 'replace', replaceCallBack);

      // 注册指令替换内容事件
      bus.on(editorId, {
        name: 'replace',
        callback: replaceCallBack
      });
    }
  }, [textAreaRef]);

  return {
    selectedText
  };
};

export const useMarked = (heading: any) => {
  const [inited, setInited] = useState(false);

  if (!inited) {
    setInited(true);
    // 标题获取
    const renderer: any = new marked.Renderer();
    // 标题重构
    renderer.heading = heading;
    renderer.defaultCode = renderer.code;

    renderer.code = (code: string, language: string, isEscaped: boolean) => {
      if (language === 'mermaid') {
        const id = new Date().getTime();
        // setTimeout(() => {
        //   mermaid.render(id + '', code);
        // }, 1000);

        return `<div class="mermaid" id="${id}">${code}</div>`;
      }

      return renderer.defaultCode(code, language, isEscaped);
    };

    renderer.image = (href: string, _: string, desc: string) => {
      return `<figure><img src="${href}" alt="${desc}"><figcaption>${desc}</figcaption></figure>`;
    };

    marked.setOptions({
      renderer,
      breaks: true
    });
  }

  return marked;
};
