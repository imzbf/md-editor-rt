import { useContext, useEffect, useRef, useState } from 'react';
import { EditorView, minimalSetup } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { Compartment } from '@codemirror/state';
import { indentWithTab, undo, redo } from '@codemirror/commands';
import { configOption } from '~/config';
import bus from '~/utils/event-bus';
import { directive2flag, ToolDirective } from '~/utils/content-help';
import { EditorContext } from '~/Editor';
import { CTRL_SHIFT_Z, CTRL_Z, ERROR_CATCHER, REPLACE } from '~/static/event-name';

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

  const [comp] = useState(() => {
    return {
      language: new Compartment(),
      theme: new Compartment(),
      autocompletion: new Compartment(),
      update: new Compartment(),
      domEvent: new Compartment()
    };
  });

  const [mdEditorCommands] = useState(() => createCommands(editorId, props));

  // 第一次延迟设置codemirror属性
  const noSet = useRef(true);

  // 粘贴上传
  const pasteHandler = usePasteUpload(props);

  const [defaultExtensions] = useState(() => {
    return [
      keymap.of([...mdEditorCommands, indentWithTab]),
      minimalSetup,
      comp.language.of(markdown({ codeLanguages: languages })),
      // 横向换行
      EditorView.lineWrapping,
      comp.update.of(
        EditorView.updateListener.of((update) => {
          update.docChanged && props.onChange(update.state.doc.toString());
        })
      ),
      comp.domEvent.of(
        EditorView.domEventHandlers({
          paste: pasteHandler,
          blur: props.onBlur,
          focus: props.onFocus,
          drop: props.onDrop,
          input: (e) => {
            props.onInput && props.onInput(e);

            const { data } = e as any;
            if (
              props.maxLength &&
              props.modelValue.length + data.length > props.maxLength
            ) {
              bus.emit(editorId, ERROR_CATCHER, {
                name: 'overlength',
                message: 'The input text is too long',
                data: data
              });
            }
          }
        })
      )
    ];
  });

  const [extensions] = useState(() => {
    return configOption.codeMirrorExtensions!(
      theme,
      [
        ...defaultExtensions,
        comp.theme.of(theme === 'light' ? oneLight : oneDark),
        comp.autocompletion.of(createAutocompletion(props.completions))
      ],
      [...mdEditorCommands]
    );
  });

  useEffect(() => {
    const view = new EditorView({
      doc: props.modelValue,
      parent: inputWrapperRef.current!,
      extensions
    });

    const nc = new CodeMirrorUt(view);
    codeMirrorUt.current = nc;

    setTimeout(() => {
      nc.setTabSize(tabWidth);
      nc.setDisabled(props.disabled!);
      nc.setReadOnly(props.readOnly!);
      props.placeholder && nc.setPlaceholder(props.placeholder);
      typeof props.maxLength === 'number' && nc.setMaxLength(props.maxLength);
      props.autoFocus && view.focus();

      noSet.current = false;
    }, 0);

    bus.on(editorId, {
      name: CTRL_Z,
      callback() {
        undo(view);
      }
    });

    bus.on(editorId, {
      name: CTRL_SHIFT_Z,
      callback() {
        redo(view);
      }
    });

    // 注册指令替换内容事件
    bus.on(editorId, {
      name: REPLACE,
      callback(direct: ToolDirective, params = {}) {
        const { text, options } = directive2flag(direct, codeMirrorUt.current!, params);
        codeMirrorUt.current?.replaceSelectedText(text, options, editorId);
      }
    });

    return () => {
      // react18的严格模式会强制在开发环境让useEffect执行两次
      view.destroy();
      noSet.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // =================

  // 主题变化切换扩展
  useEffect(() => {
    setTimeout(() => {
      codeMirrorUt.current?.view.dispatch({
        effects: comp.theme.reconfigure(theme === 'light' ? oneLight : oneDark)
      });
    }, 0);
  }, [comp.theme, theme]);

  // 更新方法变化
  useEffect(() => {
    setTimeout(() => {
      codeMirrorUt.current?.view.dispatch({
        effects: [
          comp.update.reconfigure(
            EditorView.updateListener.of((update) => {
              update.docChanged && props.onChange(update.state.doc.toString());
            })
          ),
          comp.domEvent.reconfigure(
            EditorView.domEventHandlers({
              paste: pasteHandler,
              blur: props.onBlur,
              focus: props.onFocus,
              drop: props.onDrop,
              input: (e) => {
                props.onInput && props.onInput(e);
                const { data } = e as any;
                if (
                  props.maxLength &&
                  props.modelValue.length + data.length > props.maxLength
                ) {
                  bus.emit(editorId, ERROR_CATCHER, {
                    name: 'overlength',
                    message: 'The input text is too long',
                    data: data
                  });
                }
              }
            })
          ),
          comp.autocompletion.reconfigure(createAutocompletion(props.completions))
        ]
      });
    }, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comp.domEvent, comp.update, pasteHandler, props]);

  // =================end

  useEffect(() => {
    // 只有不是输入的时候才手动设置编辑区的内容
    if (codeMirrorUt.current?.getValue() !== props.modelValue) {
      codeMirrorUt.current?.setValue(props.modelValue);
    }
  }, [props.modelValue]);

  useEffect(() => {
    if (noSet.current) {
      return;
    }
    codeMirrorUt.current?.setTabSize(tabWidth);
  }, [tabWidth]);

  useEffect(() => {
    if (noSet.current) {
      return;
    }

    codeMirrorUt.current?.setPlaceholder(props.placeholder);
  }, [props.placeholder]);

  useEffect(() => {
    if (noSet.current) {
      return;
    }

    codeMirrorUt.current?.setDisabled(props.disabled!);
  }, [props.disabled]);

  useEffect(() => {
    if (noSet.current) {
      return;
    }

    codeMirrorUt.current?.setDisabled(props.readOnly!);
  }, [props.readOnly]);

  useEffect(() => {
    if (noSet.current) {
      return;
    }

    if (typeof props.maxLength === 'number') {
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
