import { useCallback, useContext } from 'react';
import { EditorContext } from '~/Editor';
import bus from '~/utils/event-bus';
import { ERROR_CATCHER, REPLACE, UPLOAD_IMAGE } from '~/static/event-name';

import { ContentProps } from '../props';

/**
 * 处理粘贴板
 */
const usePasteUpload = (props: ContentProps) => {
  const { editorId } = useContext(EditorContext);

  // 粘贴板上传
  const pasteHandler = useCallback(
    (e: ClipboardEvent) => {
      if (!e.clipboardData) {
        return;
      }

      // 处理文件
      if (e.clipboardData.files.length > 0) {
        const { files } = e.clipboardData;

        bus.emit(
          editorId,
          UPLOAD_IMAGE,
          Array.from(files).filter((file) => {
            return /image\/.*/.test(file.type);
          })
        );

        e.preventDefault();
        return;
      }

      // 识别vscode代码
      if (props.autoDetectCode && e.clipboardData.types.includes('vscode-editor-data')) {
        const vscCoodInfo = JSON.parse(e.clipboardData.getData('vscode-editor-data'));

        bus.emit(editorId, REPLACE, 'code', {
          mode: vscCoodInfo.mode,
          text: e.clipboardData.getData('text/plain')
        });

        e.preventDefault();
        return;
      }

      const targetValue = e.clipboardData.getData('text/plain');
      if (
        props.maxLength &&
        targetValue.length + props.modelValue.length > props.maxLength
      ) {
        bus.emit(editorId, ERROR_CATCHER, {
          name: 'overlength',
          message: 'The input text is too long',
          data: targetValue
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.autoDetectCode, props.maxLength, props.modelValue]
  );

  return pasteHandler;
};
export default usePasteUpload;
