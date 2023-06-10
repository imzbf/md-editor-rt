import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EditorView, minimalSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { indentWithTab, undo, redo } from '@codemirror/commands';
import { configOption } from '~/config';
import bus from '~/utils/event-bus';
import { directive2flag, ToolDirective } from '~/utils/content-help';
import { EditorContext } from '~/Editor';

import CodeMirrorUt from '../codemirror';
import { oneDark } from '../codemirror/themeOneDark';
import { oneLight } from '../codemirror/themeLight';
import createAutocompletion from '../codemirror/autocompletion';
import { ContentProps } from '../props';
import createCommands from '../codemirror/commands';

import usePasteUpload from './usePasteUpload';
import useAttach from './useAttach';

/**
 * 文本编辑区组件
 *
 * @param props
 * @returns
 */
const useCodeMirror = (props: ContentProps) => {
  const { tabWidth, editorId, theme } = useContext(EditorContext);

  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const codeMirrorUt = useRef<CodeMirrorUt>();

  const [mdEditorCommands] = useState(() => createCommands(editorId, props));

  // 粘贴上传
  const pasteHandler = usePasteUpload(props);

  const [defaultExtensions] = useState(() => {
    return [
      keymap.of([...mdEditorCommands, indentWithTab]),
      minimalSetup,
      markdown({ codeLanguages: languages }),
      // 横向换行
      EditorView.lineWrapping,
      EditorView.updateListener.of((update) => {
        update.docChanged && props.onChange(update.state.doc.toString());
      }),
      EditorView.domEventHandlers({
        paste: pasteHandler,
        blur: props.onBlur,
        focus: props.onFocus
      })
    ];
  });

  const extensions = useMemo(() => {
    return configOption.codeMirrorExtensions!(
      theme,
      [
        ...defaultExtensions,
        theme === 'light' ? oneLight : oneDark,
        createAutocompletion(props.completions)
      ],
      [...mdEditorCommands]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.completions, theme]);

  useEffect(() => {
    const view = new EditorView({
      doc: props.value,
      parent: inputWrapperRef.current!
    });

    codeMirrorUt.current = new CodeMirrorUt(view);

    codeMirrorUt.current.setTabSize(tabWidth);
    // codeMirrorUt.current.setExtensions(extensions);

    if (props.autoFocus) {
      view.focus();
    }

    bus.on(editorId, {
      name: 'ctrlZ',
      callback() {
        undo(view);
      }
    });

    bus.on(editorId, {
      name: 'ctrlShiftZ',
      callback() {
        redo(view);
      }
    });

    // 注册指令替换内容事件
    bus.on(editorId, {
      name: 'replace',
      callback(direct: ToolDirective, params = {}) {
        const { text, options } = directive2flag(direct, codeMirrorUt.current!, params);
        codeMirrorUt.current?.replaceSelectedText(text, options);
      }
    });

    return () => {
      // react18的严格模式会强制在开发环境让useEffect执行两次
      view.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    codeMirrorUt.current?.setExtensions(extensions);
  }, [extensions]);

  useEffect(() => {
    // 只有不是输入的时候才手动设置编辑区的内容
    if (codeMirrorUt.current?.getValue() !== props.value) {
      codeMirrorUt.current?.setValue(props.value);
    }
  }, [props.value]);

  useEffect(() => {
    props.placeholder && codeMirrorUt.current?.setPlaceholder(props.placeholder);
  }, [props.placeholder]);

  useEffect(() => {
    codeMirrorUt.current?.setDisabled(props.disabled!);
  }, [props.disabled]);

  useEffect(() => {
    codeMirrorUt.current?.setDisabled(props.readOnly!);
  }, [props.readOnly]);

  useEffect(() => {
    if (props.maxLength) {
      codeMirrorUt.current?.setMaxLength(props.maxLength);
    }
  }, [props.maxLength]);

  // 附带的设置
  useAttach(codeMirrorUt);

  return {
    inputWrapperRef,
    codeMirrorUt
  };
};

export default useCodeMirror;
