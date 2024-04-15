import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EditorView } from 'codemirror';
import { keymap } from '@codemirror/view';
import { languages } from '@codemirror/language-data';
import { markdown } from '@codemirror/lang-markdown';
import { Compartment } from '@codemirror/state';
import {
  indentWithTab,
  defaultKeymap,
  history,
  historyKeymap,
  undo,
  redo
} from '@codemirror/commands';
import { configOption } from '~/config';
import bus from '~/utils/event-bus';
import { directive2flag, ToolDirective } from '~/utils/content-help';
import { EditorContext } from '~/Editor';
import {
  CTRL_SHIFT_Z,
  CTRL_Z,
  ERROR_CATCHER,
  REPLACE,
  EVENT_LISTENER
} from '~/static/event-name';
import { DOMEventHandlers } from '~/type';

import CodeMirrorUt from '../codemirror';
import { oneDark } from '../codemirror/themeOneDark';
import { oneLight } from '../codemirror/themeLight';
import createAutocompletion from '../codemirror/autocompletion';
import { ContentProps } from '../props';
import createCommands from '../codemirror/commands';

import usePasteUpload from './usePasteUpload';
// import useAttach from './useAttach';

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
      domEvent: new Compartment(),
      history: new Compartment()
    };
  });

  const [mdEditorCommands] = useState(() => createCommands(editorId, props));

  // 第一次延迟设置codemirror属性
  const noSet = useRef(true);

  // 粘贴上传
  const pasteHandler = usePasteUpload(props, codeMirrorUt);

  const [domEventHandlersUserDefined, setDEHUD] = useState<DOMEventHandlers>({});

  const domEventHandlers = useMemo<DOMEventHandlers>(() => {
    const basicHandlers: DOMEventHandlers = {
      paste: pasteHandler,
      blur: props.onBlur,
      focus: props.onFocus,
      drop: props.onDrop,
      input: (e) => {
        if (props.onInput) {
          props.onInput(e);
        }

        const { data } = e as any;
        if (props.maxLength && props.modelValue.length + data.length > props.maxLength) {
          bus.emit(editorId, ERROR_CATCHER, {
            name: 'overlength',
            message: 'The input text is too long',
            data: data
          });
        }
      }
    };

    const nextDomEventHandlers: DOMEventHandlers = {
      ...basicHandlers
    };

    const defaultEventNames = Object.keys(basicHandlers);

    for (const eventName in domEventHandlersUserDefined) {
      const en = eventName as keyof HTMLElementEventMap;

      if (defaultEventNames.includes(en)) {
        nextDomEventHandlers[en] = (e, v) => {
          domEventHandlersUserDefined[en]!(e as any, v);

          // 如果用户自行监听的事件调用了preventDefault，则不再执行内部的方法
          if (!e.defaultPrevented) {
            basicHandlers[en]!(e as any, v);
          }
        };
      } else {
        nextDomEventHandlers[en] = domEventHandlersUserDefined[en] as any;
      }
    }

    return nextDomEventHandlers;
  }, [domEventHandlersUserDefined, editorId, pasteHandler, props]);

  const [defaultExtensions] = useState(() => {
    return [
      keymap.of([...defaultKeymap, ...historyKeymap, ...mdEditorCommands, indentWithTab]),
      comp.history.of(history()),
      comp.language.of(markdown({ codeLanguages: languages })),
      // 横向换行
      EditorView.lineWrapping,
      comp.update.of(
        EditorView.updateListener.of((update) => {
          update.docChanged && props.onChange(update.state.doc.toString());
        })
      ),
      comp.domEvent.of(EditorView.domEventHandlers(domEventHandlers))
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

  const resetHistory = useCallback(() => {
    codeMirrorUt.current?.view.dispatch({
      effects: comp.history.reconfigure([])
    });

    codeMirrorUt.current?.view.dispatch({
      effects: comp.history.reconfigure(history())
    });
  }, [comp.history]);

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

    const ctrlZ = () => undo(view);
    const ctrlShiftZ = () => redo(view);
    const eventListener = (handlers: DOMEventHandlers) => {
      setDEHUD(handlers);
    };

    bus.on(editorId, {
      name: CTRL_Z,
      callback: ctrlZ
    });

    bus.on(editorId, {
      name: CTRL_SHIFT_Z,
      callback: ctrlShiftZ
    });

    // 原始事件
    bus.on(editorId, {
      name: EVENT_LISTENER,
      callback: eventListener
    });

    return () => {
      // react18的严格模式会强制在开发环境让useEffect执行两次
      view.destroy();
      bus.remove(editorId, CTRL_Z, ctrlZ);
      bus.remove(editorId, CTRL_SHIFT_Z, ctrlShiftZ);
      bus.remove(editorId, EVENT_LISTENER, eventListener);

      noSet.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const callback = (direct: ToolDirective, params = {} as any) => {
      // 弹窗插入图片时，将链接使用transformImgUrl转换后再插入
      if (direct === 'image' && params.transform) {
        const tv = props.transformImgUrl(params.url);

        if (tv instanceof Promise) {
          tv.then((url) => {
            const { text, options } = directive2flag(direct, codeMirrorUt.current!, {
              ...params,
              url
            });
            codeMirrorUt.current?.replaceSelectedText(text, options, editorId);
          }).catch((err) => {
            console.error(err);
          });
        } else {
          const { text, options } = directive2flag(direct, codeMirrorUt.current!, {
            ...params,
            url: tv
          });
          codeMirrorUt.current?.replaceSelectedText(text, options, editorId);
        }
      } else {
        const { text, options } = directive2flag(direct, codeMirrorUt.current!, params);
        codeMirrorUt.current?.replaceSelectedText(text, options, editorId);
      }
    };
    // 注册指令替换内容事件
    bus.on(editorId, {
      name: REPLACE,
      callback
    });

    return () => {
      bus.remove(editorId, REPLACE, callback);
    };
  }, [editorId, props]);

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
          comp.domEvent.reconfigure(EditorView.domEventHandlers(domEventHandlers)),
          comp.autocompletion.reconfigure(createAutocompletion(props.completions))
        ]
      });
    }, 0);
  }, [comp.autocompletion, comp.domEvent, comp.update, domEventHandlers, props]);

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
  // useAttach(codeMirrorUt);

  return {
    inputWrapperRef,
    codeMirrorUt,
    resetHistory
  };
};

export default useCodeMirror;
