import { useEffect, useState } from 'react';
import bus from '../../utils/event-bus';
import { EditorContentProp } from './';

interface HistoryDataType {
  // 历史记录列表
  list: Array<string>;
  // 是否是手动输入而非撤回
  userUpdated: boolean;
  // 当前记录位置
  curr: number;
}

// 防抖ID
let saveHistoryId = -1;

export const useHistory = (props: EditorContentProp) => {
  const { historyLength = 10, onChange = () => {} } = props;

  const [history, setHistory] = useState<HistoryDataType>({
    list: [props.value],
    userUpdated: true,
    curr: 0
  });

  useEffect(() => {
    clearTimeout(saveHistoryId);

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

        history.list.push(props.value);
        // 下标调整为最后一个位置
        history.curr = history.list.length - 1;
      } else {
        setHistory({
          ...history,
          userUpdated: true
        });
      }
    }, 500);
  }, [props.value]);

  useEffect(() => {
    bus.on(props.editorId, {
      name: 'ctrlZ',
      callback() {
        setHistory({
          ...history,
          userUpdated: false
        });
        // 倒退一个下标，最多倒退到0
        history.curr = history.curr - 1 < 0 ? 0 : history.curr - 1;
        onChange(history.list[history.curr]);
      }
    });

    bus.on(props.editorId, {
      name: 'ctrlShiftZ',
      callback() {
        setHistory({
          ...history,
          userUpdated: false
        });
        // 前进一个下标，最多倒退到最大下标
        history.curr =
          history.curr + 1 === history.list.length ? history.curr : history.curr + 1;
        onChange(history.list[history.curr]);
      }
    });
  }, []);
};
