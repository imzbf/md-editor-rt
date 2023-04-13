import { useContext, useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { indentWithTab, undo, redo, deleteLine } from '@codemirror/commands';
import bus from '~/utils/event-bus';
import { directive2flag, ToolDirective } from '~/utils/content-help';
import { EditorContext } from '~/Editor';

import CodeMirrorUt from '../codemirror';
import { oneDark } from '../codemirror/themeOneDark';
import { ContentProps } from '../props';

import usePasteUpload from './usePasteUpload';

const useCodeMirror = (props: ContentProps) => {
  const { tabWidth, editorId, theme } = useContext(EditorContext);

  const inputWrapperRef = useRef<HTMLDivElement>(null);

  const codeMirrorUt = useRef<CodeMirrorUt>();

  usePasteUpload(props, inputWrapperRef);

  const defaultExtensions = [
    keymap.of([
      indentWithTab,
      {
        key: 'Ctrl-d',
        mac: 'Cmd-d',
        run: deleteLine,
        preventDefault: true
      }
    ]),
    basicSetup,
    markdown({ codeLanguages: languages }),
    // 横向换行
    EditorView.lineWrapping,
    // 主题
    // oneDark,
    EditorView.updateListener.of((update) => {
      props.onChange(update.state.doc.toString());
    })
  ];

  useEffect(() => {
    const startState = EditorState.create({
      doc: props.value
    });

    const view = new EditorView({
      state: startState,
      parent: inputWrapperRef.current!
    });

    codeMirrorUt.current = new CodeMirrorUt(view);

    codeMirrorUt.current?.setTabSize(tabWidth);
    codeMirrorUt.current.setExtensions(defaultExtensions);

    // view.dispatch({
    //   changes: { from: 10, insert: '*' },
    //   selection: { anchor: 11 }
    // });

    // view.dispatch({
    //   selection: EditorSelection.create(
    //     [
    //       EditorSelection.range(20, 32),
    //       // EditorSelection.range(6, 7),
    //       EditorSelection.cursor(32)
    //     ],
    //     1
    //   )
    // });

    // console.log(view.state.selection.main);
    // console.log(view.state.sliceDoc());

    view.focus();
    // console.log()
    // view.dispatch(view.state.replaceSelection('`vscode`'));

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      codeMirrorUt.current?.setExtensions([...defaultExtensions, oneDark]);
    } else {
      codeMirrorUt.current?.setExtensions(defaultExtensions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    // 可控组件，只有不是输入的时候才手动设置编辑区的内容
    if (codeMirrorUt.current?.getValue() !== props.value) {
      codeMirrorUt.current?.setValue(props.value);
    }
  }, [props.value]);

  return {
    inputWrapperRef
  };
};

export default useCodeMirror;
