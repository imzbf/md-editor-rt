import { RefObject, useContext } from 'react';
import { EditorContext } from '~/Editor';
import { TEXTAREA_FOCUS } from '~/static/event-name';
import eventBus from '~/utils/event-bus';

/**
 * 一些附带的设置
 */
const useAttach = (textAreaRef: RefObject<HTMLTextAreaElement>) => {
  const { editorId } = useContext(EditorContext);

  eventBus.on(editorId, {
    name: TEXTAREA_FOCUS,
    callback() {
      textAreaRef.current?.focus();
    }
  });
};

export default useAttach;
