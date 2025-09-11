import {
  indentWithTab,
  defaultKeymap,
  history,
  historyKeymap,
  undo,
  redo
} from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Compartment, Extension } from '@codemirror/state';
import { EditorView, keymap, drawSelection } from '@codemirror/view';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { globalConfig } from '~/config';
import { EditorContext } from '~/context';
import {
  CTRL_SHIFT_Z,
  CTRL_Z,
  ERROR_CATCHER,
  REPLACE,
  EVENT_LISTENER,
  TASK_STATE_CHANGED,
  SEND_EDITOR_VIEW,
  GET_EDITOR_VIEW
} from '~/static/event-name';
import { CodeMirrorExtension, DOMEventHandlers } from '~/type';
import { directive2flag, ToolDirective } from '~/utils/content-help';
import bus from '~/utils/event-bus';

import CodeMirrorUt from '../codemirror';

import usePasteUpload from './usePasteUpload';
import { createAutocompletion } from '../codemirror/autocompletion';
import { createCommands } from '../codemirror/commands';
import { createFloatingToolbar } from '../codemirror/floatingToolbar';
import { TextShortenerOptions, createTextShortener } from '../codemirror/textShortener';
import { oneLight } from '../codemirror/themeLight';
import { oneDark } from '../codemirror/themeOneDark';
import { ContentProps } from '../props';
import { useToolbarEffect } from './useToolbarEffect';
// import useAttach from './useAttach';
// 禁用掉>=6.28.0的实验性功能
(EditorView as any).EDIT_CONTEXT = false;

const getSourceExtension = (item: CodeMirrorExtension) => {
  return item.extension instanceof Function
    ? item.extension(item.options)
    : item.extension;
};

const produceExtension = (item: CodeMirrorExtension): Extension => {
  const extension = getSourceExtension(item);
  return item.compartment ? item.compartment.of(extension) : extension;
};
/**
 * 文本编辑区组件
 *
 * @param props
 * @returns
 */
const useCodeMirror = (props: ContentProps) => {
  const contextValue = useContext(EditorContext);
  const { tabWidth, editorId, theme, noPrettier, disabled, floatingToolbars } =
    contextValue;

  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const codeMirrorUt = useRef<CodeMirrorUt>(null);
  // 第一次延迟设置codemirror属性
  const noSet = useRef(true);

  const [comp] = useState(() => {
    return {
      theme: new Compartment(),
      autocompletion: new Compartment(),
      update: new Compartment(),
      domEvent: new Compartment(),
      history: new Compartment(),
      floatingToolbar: new Compartment()
    };
  });

  const [mdEditorCommands] = useState(() => createCommands(editorId, { noPrettier }));

  // 搜集默认快捷键列表，通过方法返回，防止默认列表被篡改
  const getDefaultKeymaps = useCallback(
    () => [...mdEditorCommands, ...defaultKeymap, ...historyKeymap, indentWithTab],
    [mdEditorCommands]
  );

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
            data
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
          (domEventHandlersUserDefined[en] as (event: Event, view: EditorView) => void)(
            e,
            v
          );
          // 如果用户自行监听的事件调用了preventDefault，则不再执行内部的方法
          if (!e.defaultPrevented) {
            (basicHandlers[en] as (event: Event, view: EditorView) => void)(e, v);
          }
        };
      } else {
        nextDomEventHandlers[en] = domEventHandlersUserDefined[en] as any;
      }
    }

    return nextDomEventHandlers;
  }, [domEventHandlersUserDefined, editorId, pasteHandler, props]);

  const listeners = useRef(new Set<() => void>());
  const contextValueRef = useRef(contextValue);

  useEffect(() => {
    contextValueRef.current = contextValue;
    listeners.current.forEach((cb) => cb());
  }, [contextValue]);

  const [floatingToolbarExtension] = useState(() => {
    return createFloatingToolbar({
      contextValue: {
        getValue: () => {
          return contextValueRef.current;
        },
        subscribe: (cb: () => void) => {
          listeners.current.add(cb);
          return () => listeners.current.delete(cb);
        }
      }
    });
  });

  /**
   * 不让用户修改的扩展
   */
  const [defaultExtensions] = useState(() => {
    return [
      {
        type: 'theme',
        extension: theme === 'light' ? oneLight : oneDark,
        compartment: comp.theme
      },
      {
        type: 'updateListener',
        extension: EditorView.updateListener.of((update) => {
          if (update.docChanged) props.onChange(update.state.doc.toString());
        }),
        compartment: comp.update
      },
      {
        type: 'domEventHandlers',
        extension: EditorView.domEventHandlers(domEventHandlers),
        compartment: comp.domEvent
      },
      {
        type: 'completions',
        extension: createAutocompletion(props.completions),
        compartment: comp.autocompletion
      },
      {
        type: 'history',
        extension: history(),
        compartment: comp.history
      }
    ];
  });

  const [userDefindeExtension] = useState(() => {
    return globalConfig.codeMirrorExtensions(
      [
        // 横向换行
        {
          type: 'lineWrapping',
          extension: EditorView.lineWrapping
        },

        {
          type: 'keymap',
          extension: keymap.of(getDefaultKeymaps())
        },
        // 解决多行placeholder时，光标异常的情况
        {
          type: 'drawSelection',
          extension: drawSelection()
        },
        {
          type: 'markdown',
          extension: markdown({ codeLanguages: languages })
        },
        {
          type: 'linkShortener',
          extension: (options: any) =>
            createTextShortener(options as TextShortenerOptions),
          options: {
            maxLength: 30
          }
        },
        {
          type: 'floatingToolbar',
          extension: floatingToolbars.length > 0 ? floatingToolbarExtension : [],
          compartment: comp.floatingToolbar
        }
      ],
      { editorId, theme: theme, keyBindings: getDefaultKeymaps() }
    );
  });

  const [extensions] = useState(() => {
    return [...userDefindeExtension, ...defaultExtensions].map(produceExtension);
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
      nc.setDisabled(!!disabled);
      nc.setReadOnly(props.readOnly!);
      if (props.placeholder) nc.setPlaceholder(props.placeholder);
      if (typeof props.maxLength === 'number') nc.setMaxLength(props.maxLength);
      if (props.autoFocus) view.focus();

      noSet.current = false;
    }, 0);

    const ctrlZ = () => undo(view);
    const ctrlShiftZ = () => redo(view);
    const eventListener = (handlers: DOMEventHandlers) => {
      setDEHUD(handlers);
    };

    const taskStateChanged = (lineNumber: number, value: string) => {
      const line = view.state.doc.line(lineNumber);
      // 应用交易到编辑器视图
      view.dispatch(
        view.state.update({
          changes: { from: line.from, to: line.to, insert: value }
        })
      );
    };

    const sendEditorView = () => {
      bus.emit(editorId, GET_EDITOR_VIEW, view);
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

    // 点击任务修改事件
    bus.on(editorId, {
      name: TASK_STATE_CHANGED,
      callback: taskStateChanged
    });

    bus.on(editorId, {
      name: SEND_EDITOR_VIEW,
      callback: sendEditorView
    });

    // 主动触发一次获取编辑器视图
    bus.emit(editorId, GET_EDITOR_VIEW, view);

    return () => {
      // react18的严格模式会强制在开发环境让useEffect执行两次
      view.destroy();
      bus.remove(editorId, CTRL_Z, ctrlZ);
      bus.remove(editorId, CTRL_SHIFT_Z, ctrlShiftZ);
      bus.remove(editorId, EVENT_LISTENER, eventListener);
      bus.remove(editorId, TASK_STATE_CHANGED, taskStateChanged);
      bus.remove(editorId, SEND_EDITOR_VIEW, sendEditorView);

      noSet.current = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const callback = async (direct: ToolDirective, params = {} as any) => {
      // 弹窗插入图片时，将链接使用transformImgUrl转换后再插入
      if (direct === 'image' && params.transform) {
        const tv = props.transformImgUrl(params.url as string);

        if (tv instanceof Promise) {
          tv.then(async (url) => {
            const { text, options } = await directive2flag(
              direct,
              codeMirrorUt.current!,
              {
                ...params,
                url
              }
            );
            codeMirrorUt.current?.replaceSelectedText(text as string, options, editorId);
          }).catch((err) => {
            console.error(err);
          });
        } else {
          const { text, options } = await directive2flag(direct, codeMirrorUt.current!, {
            ...params,
            url: tv
          });
          codeMirrorUt.current?.replaceSelectedText(text as string, options, editorId);
        }
      } else {
        const { text, options } = await directive2flag(
          direct,
          codeMirrorUt.current!,
          params
        );
        codeMirrorUt.current?.replaceSelectedText(text as string, options, editorId);
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
              if (update.docChanged) props.onChange(update.state.doc.toString());
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

    codeMirrorUt.current?.setDisabled(!!disabled);
  }, [disabled]);

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

  /** 如果用户直接在组件上给floatingToolbars属性赋动态的值，会导致reconfigure抛错 */
  useToolbarEffect(() => {
    const _floatingToolbarExtension = userDefindeExtension.find(
      (extension) => extension.type === 'floatingToolbar'
    );

    if (!_floatingToolbarExtension?.compartment) {
      return;
    }

    if (floatingToolbars.length > 0) {
      codeMirrorUt.current?.view.dispatch({
        effects: _floatingToolbarExtension.compartment.reconfigure(
          getSourceExtension(_floatingToolbarExtension)
        )
      });
    } else
      codeMirrorUt.current?.view.dispatch({
        effects: _floatingToolbarExtension.compartment.reconfigure([])
      });
  }, floatingToolbars);

  // 附带的设置
  // useAttach(codeMirrorUt);

  return {
    inputWrapperRef,
    codeMirrorUt,
    resetHistory
  };
};

export default useCodeMirror;
