import { useContext, useEffect } from 'react';
import { EditorContext } from '~/Editor';
import { ContentPreviewProps } from '../props';
import bus from '~/utils/event-bus';
import { TASK_STATE_CHANGED } from '~/static/event-name';

const template = {
  checked: {
    regexp: /- \[x\]/,
    value: '- [ ]'
  },
  unChecked: {
    regexp: /- \[\s\]/,
    value: '- [x]'
  }
};

export const useTaskState = (props: ContentPreviewProps, html: string) => {
  const { editorId, rootRef } = useContext(EditorContext);

  useEffect(() => {
    const tasks = rootRef!.current?.querySelectorAll('.task-list-item.enabled') || [];

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
