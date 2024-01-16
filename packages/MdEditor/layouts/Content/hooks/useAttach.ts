import { RefObject, useContext } from 'react';
import { EditorContext } from '~/Editor';
import { TEXTAREA_FOCUS } from '~/static/event-name';
import eventBus from '~/utils/event-bus';
import CodeMirrorUt from '../codemirror';

/**
 * 一些附带的设置
 *
 * @deprecated 暂时没啥用
 */
const useAttach = (codeMirrorUt: RefObject<CodeMirrorUt | undefined>) => {
  const { editorId } = useContext(EditorContext);

  eventBus.on(editorId, {
    name: TEXTAREA_FOCUS,
    callback(options) {
      codeMirrorUt.current?.focus(options);
    }
  });
};

export default useAttach;
