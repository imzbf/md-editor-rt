import { useContext, useEffect } from 'react';
import { ContentPreviewProps } from '../props';
import { EditorContext } from '~/context';
import { TASK_STATE_CHANGED } from '~/static/event-name';
import bus from '~/utils/event-bus';

const template = {
  checked: {
    regexp: /\[[xX]\]/,
    value: '[ ]'
  },
  unChecked: {
    regexp: /\[ \]/,
    value: '[x]'
  }
};

export const useTaskState = (props: ContentPreviewProps, html: string) => {
  const { editorId, rootRef } = useContext(EditorContext);

  useEffect(() => {
    // 只监听复选框，避免正文点击误改任务及嵌套列表冒泡导致的重复更新。
    const tasks =
      rootRef!.current?.querySelectorAll(
        '.task-list-item.enabled .task-list-item-checkbox'
      ) || [];

    const listener = (e: Event) => {
      e.preventDefault();
      const nextValue = (e.target as HTMLInputElement).checked ? 'unChecked' : 'checked';
      const line = (e.target as HTMLInputElement).parentElement?.dataset.line;

      if (!line) {
        return;
      }

      const lineNumber = Number(line);

      const lines = props.modelValue.split('\n');
      const targetValue = lines[Number(lineNumber)].replace(
        template[nextValue].regexp,
        template[nextValue].value
      );

      if (props.previewOnly) {
        lines[Number(lineNumber)] = targetValue;
        props.onChange(lines.join('\n'));
      } else {
        bus.emit(editorId, TASK_STATE_CHANGED, lineNumber + 1, targetValue);
      }
    };

    tasks.forEach((item) => {
      item.addEventListener('click', listener);
    });

    return () => {
      tasks.forEach((item) => {
        item.removeEventListener('click', listener);
      });
    };
  }, [editorId, html, props, rootRef]);
};
