import { RefObject, useCallback, useContext } from 'react';
import { EditorContext } from '~/Editor';
import bus from '~/utils/event-bus';
import { ERROR_CATCHER, REPLACE, UPLOAD_IMAGE } from '~/static/event-name';

import { ContentProps } from '../props';
import CodeMirrorUt from '../codemirror';

/**
 * 处理粘贴板
 */
const usePasteUpload = (
  props: ContentProps,
  codeMirrorUt: RefObject<CodeMirrorUt | undefined>
) => {
  const { editorId } = useContext(EditorContext);

  const imgInsert = useCallback(
    (tv: string | Promise<string>) => {
      if (tv instanceof Promise) {
        tv.then((targetValue) => {
          bus.emit(editorId, REPLACE, 'universal', {
            generate() {
              return {
                targetValue
              };
            }
          });
        }).catch((err) => {
          console.error(err);
        });
      } else {
        bus.emit(editorId, REPLACE, 'universal', {
          generate() {
            return {
              targetValue: tv
            };
          }
        });
      }
    },
    [editorId]
  );

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
      const targetValue = e.clipboardData.getData('text/plain');

      const to = codeMirrorUt.current?.view.state.selection.main.to || 0;
      const from = codeMirrorUt.current?.view.state.doc.lineAt(to).from || 0;
      // 当前光标到当前行开头的字符串
      const lineStart = codeMirrorUt.current?.view.state.doc.sliceString(from, to) || '';

      // 图片语法在当前行开头
      const templateStart = /!\[.*\]\(\s*$/.test(lineStart);
      // 图片语法在粘贴的内容中
      const templateIn = /!\[.*\]\((.*)\s?.*\)/.test(targetValue);

      if (templateStart) {
        const tv = props.transformImgUrl(targetValue);
        imgInsert(tv);

        e.preventDefault();
        return;
      } else if (templateIn) {
        const matchArr = targetValue.match(
          /(?<=!\[.*\]\()([^)\s]+)(?=\s?["']?.*["']?\))/g
        );

        if (matchArr) {
          Promise.all(
            matchArr.map((img: string) => {
              return props.transformImgUrl(img);
            })
          ).then((newUrls: string[]) => {
            imgInsert(
              newUrls.reduce((prev, curr, index) => {
                return prev.replace(matchArr[index], curr);
              }, targetValue)
            );
          });
        } else {
          imgInsert(targetValue);
        }

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
    [codeMirrorUt, editorId, imgInsert, props]
  );

  return pasteHandler;
};
export default usePasteUpload;
