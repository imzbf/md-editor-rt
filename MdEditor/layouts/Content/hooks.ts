import { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import copy from 'copy-to-clipboard';
import mediumZoom from 'medium-zoom';
import { marked, Renderer } from 'marked';
import { HeadList, RewriteHeading } from '../../type';
import {
  insert,
  setPosition,
  scrollAuto,
  generateCodeRowNumber,
  getSelectionText,
  uuid
} from '../../utils';
import { directive2flag, ToolDirective } from '../../utils/content-help';
import bus from '../../utils/event-bus';
import { EditorContentProp } from './';
import { EditorContext } from '../../Editor';
import { prefix, katexUrl, mermaidUrl, configOption } from '../../config';
import { appendHandler, updateHandler } from '../../utils/dom';
import kaTexExtensions from '../../utils/katex';
import alertExtension from '../../utils/alert';
import { TEXTAREA_FOCUS } from '../../static/event-name';
import { isServer } from '../../static/env';

interface HistoryItemType {
  // 记录内容
  content: string;
  // 本次记录鼠标选择内容开始位置
  startPos: number;
  // 结束位置
  endPos: number;
}

interface HistoryDataType {
  // 历史记录列表
  list: Array<HistoryItemType>;
  // 是否是手动输入而非撤回
  userUpdated: boolean;
  // 当前记录位置
  curr: number;
}

// 防抖ID
let saveHistoryId = -1;
// 光标初始位置
const POSITION_START = [0, 0];

export const useHistory = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>,
  completeStatus: RefObject<boolean>
) => {
  const { historyLength, editorId } = useContext(EditorContext);

  const history = useRef<HistoryDataType>({
    list: [
      {
        content: props.value,
        startPos: textAreaRef.current?.selectionStart || 0,
        endPos: textAreaRef.current?.selectionEnd || 0
      }
    ],
    userUpdated: true,
    curr: 0
  });

  // 文本改变前的光标位置
  const historyPos = useRef(POSITION_START);

  const keyZCallback = useCallback(
    (curr: number) => {
      // 保存当前的鼠标位置
      const startPos: number = textAreaRef.current?.selectionStart || 0;
      const endPos: number = textAreaRef.current?.selectionEnd || 0;

      history.current.list[history.current.curr].startPos = startPos;
      history.current.list[history.current.curr].endPos = endPos;

      // 移除状态
      history.current.userUpdated = false;
      history.current.curr = curr;

      const currHistory = history.current.list[history.current.curr];

      // 恢复光标位置
      historyPos.current = [currHistory.startPos, currHistory.endPos];
      props.onChange(currHistory.content);

      // 选中内容
      setPosition(
        textAreaRef.current as HTMLTextAreaElement,
        currHistory.startPos,
        currHistory.endPos
      ).then(() => {
        bus.emit(editorId, 'selectTextChange');
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props, textAreaRef]
  );

  /**
   * @param force 是否强制更新光标历史
   */
  const saveHistoryPos = useCallback(
    (force: boolean) => {
      // 如果不是初始值，代表上次记录未插入输入历史
      if (historyPos.current === POSITION_START || force) {
        historyPos.current = [
          textAreaRef.current?.selectionStart || 0,
          textAreaRef.current?.selectionEnd || 0
        ];
      }
    },
    [textAreaRef]
  );

  useEffect(() => {
    if (completeStatus) {
      clearTimeout(saveHistoryId);
      const startPos: number = textAreaRef.current?.selectionStart || 0;
      const endPos: number = textAreaRef.current?.selectionEnd || 0;

      saveHistoryId = <any>setTimeout(() => {
        // 如果不是撤销操作，就记录
        if (history.current.userUpdated) {
          // 重置撤回之前的记录
          if (history.current.curr < history.current.list.length - 1) {
            history.current.list = history.current.list.slice(
              0,
              history.current.curr + 1
            );
          }
          if (history.current.list.length > historyLength) {
            history.current.list.shift();
          }

          // 修改保存上次记录选中定位
          const lastStep = history.current.list.pop() || {
            startPos: 0,
            endPos: 0,
            content: props.value
          };

          lastStep.startPos = historyPos.current[0];
          lastStep.endPos = historyPos.current[1];

          // 恢复初始位置历史
          historyPos.current = POSITION_START;

          Array.prototype.push.call(history.current.list, lastStep, {
            content: props.value,
            startPos,
            endPos
          });

          // 下标调整为最后一个位置
          history.current.curr = history.current.list.length - 1;
        } else {
          history.current.userUpdated = true;
        }
      }, 150);
    }
  }, [props.value, completeStatus, textAreaRef, historyLength]);

  useEffect(() => {
    // 更新后清除选中内容
    bus.emit(editorId, 'selectTextChange');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    const ctrlZHandler = () => {
      keyZCallback(history.current.curr - 1 < 0 ? 0 : history.current.curr - 1);
    };

    const ctrlShiftZHandler = () => {
      keyZCallback(
        history.current.curr + 1 === history.current.list.length
          ? history.current.curr
          : history.current.curr + 1
      );
    };

    bus.on(editorId, {
      name: 'ctrlZ',
      callback: ctrlZHandler
    });

    bus.on(editorId, {
      name: 'ctrlShiftZ',
      callback: ctrlShiftZHandler
    });

    bus.on(editorId, {
      name: 'saveHistoryPos',
      callback: saveHistoryPos
    });

    return () => {
      bus.remove(editorId, 'ctrlZ', ctrlZHandler);
      bus.remove(editorId, 'ctrlShiftZ', ctrlShiftZHandler);
      bus.remove(editorId, 'saveHistoryPos', saveHistoryPos);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyZCallback, saveHistoryPos]);
};

/**
 * 处理输入框中的一些交互事件，例如：列表回车生成一个新的空行列表等
 *
 * @param props ContentProps
 * @param textAreaRef 输入框
 */
export const useAutoGenrator = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const selectedText = useRef('');
  const { previewOnly, tabWidth, editorId } = useContext(EditorContext);

  useEffect(() => {
    const textAreaOnKeypress = (event: any) => {
      if (event.key === 'Enter') {
        const endPoint = textAreaRef.current?.selectionStart as number;

        // 前半部分
        const prefixStr = textAreaRef.current?.value.substring(0, endPoint);
        // 后半部分
        const subStr = textAreaRef.current?.value.substring(endPoint);
        // 前半部分最后一个换行符位置，用于分割当前行内容
        const lastIndexBR = prefixStr?.lastIndexOf('\n');

        const enterPressRow = prefixStr?.substring(
          (lastIndexBR as number) + 1,
          endPoint
        ) as string;

        // 是列表
        if (/^\d+\.\s|^-\s/.test(enterPressRow)) {
          event.cancelBubble = true;
          event.preventDefault();
          event.stopPropagation();

          // 如果列表当前行没有内容，则清空当前行
          // '- ', '- [ ] ', '- [x] '，-同数字
          if (/^(\d+\.|-)\s+(\[[x\s]\]\s+)?$/.test(enterPressRow)) {
            const resetPrefixStr = prefixStr?.replace(/(\d+\.|-)\s+(\[[x\s]\]\s+)?$/, '');

            props.onChange((resetPrefixStr as string) + subStr);

            // 手动定位光标到当前位置
            setPosition(
              textAreaRef.current as HTMLTextAreaElement,
              resetPrefixStr?.length
            );
          } else if (/^-\s+.+/.test(enterPressRow)) {
            const newLine = /^-\s+\[[x\s]\]/.test(enterPressRow) ? '\n- [ ] ' : '\n- ';
            // 无序列表存在内容
            props.onChange(
              insert(textAreaRef.current as HTMLTextAreaElement, newLine, {})
            );
          } else {
            const lastOrderMatch = enterPressRow?.match(/\d+(?=\.)/);

            const nextOrder = (lastOrderMatch && Number(lastOrderMatch[0]) + 1) || 1;

            const newLine = /^\d\.\s+\[[x\s]\]/.test(enterPressRow)
              ? `\n${nextOrder}. [ ] `
              : `\n${nextOrder}. `;

            props.onChange(
              insert(textAreaRef.current as HTMLTextAreaElement, newLine, {})
            );
          }
        }
      }
    };

    const onSelectedTextChangd = () => {
      selectedText.current = getSelectionText(textAreaRef.current as HTMLTextAreaElement);
    };

    if (!previewOnly) {
      textAreaRef.current?.addEventListener('keypress', textAreaOnKeypress);

      // 注册修改选择内容事件
      bus.on(editorId, {
        name: 'selectTextChange',
        callback: onSelectedTextChangd
      });
    }

    return () => {
      if (!previewOnly) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textAreaRef.current?.removeEventListener('keypress', textAreaOnKeypress);
        bus.remove(editorId, 'selectTextChange', onSelectedTextChangd);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onChange]);

  useEffect(() => {
    const replaceCallBack = (direct: ToolDirective, params = {}) => {
      props.onChange(
        directive2flag(
          direct,
          selectedText.current,
          textAreaRef.current as HTMLTextAreaElement,
          {
            ...params,
            tabWidth,
            editorId
          }
        )
      );
    };

    if (!previewOnly) {
      // 注册指令替换内容事件
      bus.on(editorId, {
        name: 'replace',
        callback: replaceCallBack
      });
    }

    return () => {
      if (!previewOnly) {
        bus.remove(editorId, 'replace', replaceCallBack);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onChange, tabWidth, textAreaRef]);

  return {
    selectedText
  };
};

export const useMarked = (props: EditorContentProp) => {
  const { onHtmlChanged = () => {}, onGetCatalog = () => {} } = props;
  const { editorId, showCodeRowNumber, highlight, previewOnly } =
    useContext(EditorContext);

  const { markedRenderer, markedOptions, markedExtensions, editorConfig } = configOption;
  const highlightIns = configOption.editorExtensions?.highlight?.instance;
  const mermaidIns = configOption.editorExtensions?.mermaid?.instance;

  // 当页面已经引入完成对应的库时，通过修改从状态完成marked重新编译
  const [highlightInited, setHighlightInited] = useState<boolean>(() => {
    return !!highlightIns;
  });

  const heads = useRef<HeadList[]>([]);

  // mermaid@10以后不再提供同步方法
  // 调整为ID站位，异步转译后替换
  const mermaidTasks = useRef<Array<Promise<any>>>([]);
  const mermaidIds = useRef<Array<string>>([]);

  const [renderer] = useState(() => {
    let renderer = new marked.Renderer();

    // 1. 设定可被覆盖的内部模块渲染方式
    // 1.1 图片
    renderer.image = (href, title, desc) => {
      return `<span class="figure"><img src="${href}" title="${title || ''}" alt="${
        desc || ''
      }" zoom><span class="figcaption">${desc || ''}</span></span>`;
    };
    // 1.2 列表
    renderer.listitem = (text: string, task: boolean) => {
      return task ? `<li class="li-task">${text}</li>` : `<li>${text}</li>`;
    };

    // 2. 设定自定义的renderer
    if (markedRenderer instanceof Function) {
      renderer = markedRenderer(renderer) as Renderer;
    }

    // 3. 设定内部携带不可覆盖逻辑的模块
    // 3.1 代码
    const markedCode = renderer.code;
    renderer.code = (code, language, isEscaped) => {
      if (!props.noMermaid && language === 'mermaid') {
        const idRand = uuid();

        try {
          // ==========
          //   服务端
          // ==========
          if (isServer) {
            // 无论是否提供实例，mermaid均不支持在node运行
            // 这块图源码不会正确显示在页面上，但可被搜索引擎捕获
            return `<p class="${prefix}-mermaid-loading">${code}</p>`;
          }
          // ==========
          //   客户端
          // ==========
          else {
            const mermaid = mermaidIns || window.mermaid;

            if (mermaid) {
              mermaidTasks.current.push(mermaid.mermaidAPI.render(idRand, code));
            } else {
              // 这块图源码不会正确展示在页面上
              return `<p class="${prefix}-mermaid-loading">${code}</p>`;
            }
          }

          const mermaidTemplate = `<script type="text/tmplate"<${idRand}</script>`;

          mermaidIds.current.push(mermaidTemplate);

          // 返回占位符
          return mermaidTemplate;
        } catch (error: any) {
          // 兼容@9及以下的错误提示
          return `<p class="${prefix}-mermaid-error">Error: ${error?.message || ''}</p>`;
        }
      }

      return markedCode
        .call(renderer, code, language, isEscaped)
        .replace(
          /^<pre><code\sclass="language-([^>]*)">/,
          '<pre><code class="language-$1" language="$1">'
        );
    };

    // 3.2 标题
    const newHeading = renderer.heading;
    // 判断是否有重写heading
    const isNewHeading = newHeading !== new marked.Renderer().heading;

    renderer.heading = (text, level, raw, slugger) => {
      heads.current.push({ text: raw, level });

      // 我们默认同一级别的标题，你不会定义两个相同的
      const id = props.markedHeadingId(raw, level, heads.current.length);

      // 如果heading被重写了，使用新的heading
      if (isNewHeading) {
        return (newHeading as RewriteHeading).call(
          renderer,
          text,
          level,
          raw,
          slugger,
          heads.current.length,
          id
        );
      }

      // 如果标题有markdown语法内容，会按照该语法添加标题，而不再自定义，但是仍然支持目录定位
      if (text !== raw) {
        return `<h${level} id="${id}">${text}</h${level}>`;
      } else {
        return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
      }
    };

    // 4. 设定option
    // 4.1
    // 提供了hljs，在创建阶段即完成设置
    if (highlightIns) {
      marked.setOptions({
        highlight: (code, language) => {
          let codeHtml = '';
          const hljsLang = highlightIns.getLanguage(language);
          if (language && hljsLang) {
            codeHtml = highlightIns.highlight(code, {
              language,
              ignoreIllegals: true
            }).value;
          } else {
            codeHtml = highlightIns.highlightAuto(code).value;
          }

          return showCodeRowNumber
            ? generateCodeRowNumber(codeHtml)
            : `<span class="code-block">${codeHtml}</span>`;
        }
      });
    }

    // 4.2 自定义option覆盖
    marked.setOptions({
      breaks: true,
      ...markedOptions
    });

    // 5. 设置自定义的marked扩展
    if (markedExtensions instanceof Array && markedExtensions.length > 0) {
      marked.use({
        extensions: markedExtensions
      });
    }

    // 5.1 内部扩展扩展
    marked.use({
      extensions: [alertExtension]
    });

    return renderer;
  });

  const katexInited = useKatex(props, marked);
  const { reRender, mermaidInited } = useMermaid(props);

  // 添加highlight扩展
  useEffect(() => {
    let highlightLink: HTMLLinkElement;
    let highlightScript: HTMLScriptElement;

    if (!highlightIns) {
      const highlightLoad = () => {
        marked.setOptions({
          highlight: (code, language) => {
            let codeHtml = '';
            const hljsLang = window.hljs.getLanguage(language);
            if (language && hljsLang) {
              codeHtml = window.hljs.highlight(code, {
                language,
                ignoreIllegals: true
              }).value;
            } else {
              codeHtml = window.hljs.highlightAuto(code).value;
            }

            return showCodeRowNumber
              ? generateCodeRowNumber(codeHtml)
              : `<span class="code-block">${codeHtml}</span>`;
          }
        });

        setHighlightInited(true);
      };

      highlightLink = document.createElement('link');
      highlightLink.rel = 'stylesheet';
      highlightLink.href = highlight.css;
      highlightLink.id = `${prefix}-hlCss`;

      highlightScript = document.createElement('script');
      highlightScript.src = highlight.js;
      highlightScript.onload = highlightLoad;
      highlightScript.id = `${prefix}-hljs`;

      appendHandler(highlightLink);
      appendHandler(highlightScript, 'hljs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateHandler(`${prefix}-hlCss`, 'href', highlight.css);
  }, [highlight.css]);

  // ---预览代码---
  const [html, setHtml] = useState(() => {
    return props.sanitize(marked(props.value || '', { renderer }));
  });

  /**
   * 手动替换占位符
   */
  const asyncReplace = async () => {
    /**
     * 未处理占位符的html
     */
    let unresolveHtml = props.sanitize(marked(props.value || '', { renderer }));
    const taskResults = await Promise.allSettled(mermaidTasks.current);
    taskResults.forEach((r, index) => {
      // 正常完成，替换模板
      if (r.status === 'fulfilled') {
        unresolveHtml = unresolveHtml.replace(
          mermaidIds.current[index],
          `<p class="${prefix}-mermaid">${
            typeof r.value === 'string' ? r.value : r.value.svg
          }</p>`
        );
      } else {
        unresolveHtml = unresolveHtml.replace(
          mermaidIds.current[index],
          `<p class="${prefix}-mermaid-error">${r.reason || ''}</p>`
        );
      }
    });
    // 替换后移除占位信息
    mermaidIds.current = [];
    mermaidTasks.current = [];

    return unresolveHtml;
  };

  useEffect(() => {
    const timer = setTimeout(
      () => {
        heads.current = [];
        asyncReplace().then((resolveHtml) => {
          setHtml(resolveHtml);
          onHtmlChanged(resolveHtml);
          // 构建完成，传递onSave新的html
          bus.emit(editorId, 'buildFinished', resolveHtml);
          // 传递标题
          onGetCatalog(heads.current);
          // 生成目录
          bus.emit(editorId, 'catalogChanged', heads.current);
        });
      },
      editorConfig?.renderDelay !== undefined
        ? editorConfig?.renderDelay
        : previewOnly
        ? 0
        : 500
    );

    return () => {
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value, highlightInited, mermaidInited, reRender, katexInited]);

  // 添加目录主动触发接收监听
  useEffect(() => {
    bus.on(editorId, {
      name: 'pushCatalog',
      callback() {
        bus.emit(editorId, 'catalogChanged', heads.current);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { html };
};

/**
 * 注册mermaid扩展到marked
 *
 */
export const useMermaid = (props: EditorContentProp) => {
  const { theme } = useContext(EditorContext);

  const mermaidConf = configOption.editorExtensions?.mermaid;

  // 修改它触发重新编译
  const [reRender, setReRender] = useState<boolean>(false);
  const [mermaidInited, setMermaidInited] = useState<boolean>(!!mermaidConf?.instance);

  useEffect(() => {
    if (!props.noMermaid) {
      // 提供了外部实例
      if (mermaidConf?.instance) {
        mermaidConf?.instance.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default'
        });
      } else if (window.mermaid) {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default'
        });
      }
      setReRender((_reRender) => !_reRender);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    let mermaidScript: HTMLScriptElement;
    // 引入mermaid
    if (!props.noMermaid && !mermaidConf?.instance) {
      mermaidScript = document.createElement('script');

      const jsSrc = mermaidConf?.js || mermaidUrl;
      if (/\.mjs/.test(jsSrc)) {
        mermaidScript.setAttribute('type', 'module');
        mermaidScript.innerHTML = `import mermaid from "${jsSrc}";window.mermaid=mermaid;document.getElementById('${prefix}-mermaid').onload();`;
      } else {
        mermaidScript.src = jsSrc;
      }

      mermaidScript.onload = () => {
        window.mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          logLevel: import.meta.env.MODE === 'development' ? 'Error' : 'Fatal'
        });
        setMermaidInited(true);
      };
      mermaidScript.id = `${prefix}-mermaid`;

      appendHandler(mermaidScript, 'mermaid');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { reRender, mermaidInited };
};

export const useKatex = (props: EditorContentProp, marked: any) => {
  // 获取相应的扩展配置链接
  const katexConf = configOption.editorExtensions?.katex;
  const katexIns = katexConf?.instance;

  const [katexInited, setKatexInited] = useState(false);

  // 当没有设置不使用katex，直接扩展组件
  if (!props.noKatex) {
    marked.use({
      extensions: [
        kaTexExtensions.inline(prefix, katexIns),
        kaTexExtensions.block(prefix, katexIns)
      ]
    });
  }

  useEffect(() => {
    let katexScript: HTMLScriptElement;
    let katexLink: HTMLLinkElement;
    // 标签引入katex
    if (!props.noKatex && !katexIns) {
      katexScript = document.createElement('script');

      katexScript.src = katexConf?.js || katexUrl.js;
      katexScript.onload = () => {
        setKatexInited(true);
      };
      katexScript.id = `${prefix}-katex`;

      katexLink = document.createElement('link');
      katexLink.rel = 'stylesheet';
      katexLink.href = katexConf?.css || katexUrl.css;
      katexLink.id = `${prefix}-katexCss`;

      appendHandler(katexScript, 'katex');
      appendHandler(katexLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return katexInited;
};

/**
 * 自动滚动
 * @param props
 * @param html
 * @param textAreaRef
 * @param previewRef
 * @param htmlRef
 */
export const useAutoScroll = (
  props: EditorContentProp,
  html: string,
  textAreaRef: RefObject<HTMLElement>,
  previewRef: RefObject<HTMLElement>,
  htmlRef: RefObject<HTMLElement>
) => {
  const { previewOnly, editorId, usedLanguageText } = useContext(EditorContext);
  const { formatCopiedText = (t: string) => t } = props;
  const [scrollCb, setScrollCb] = useState({
    clear() {},
    init() {}
  });

  // 初始化滚动事件
  useEffect(() => {
    if (!previewOnly && (previewRef.current || htmlRef.current)) {
      const [init, clear] = scrollAuto(
        textAreaRef.current as HTMLElement,
        (previewRef.current as HTMLElement) || htmlRef.current
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      // 需要等到页面挂载完成后再注册，否则不能正确获取到预览dom
      const [init, clear] = scrollAuto(
        textAreaRef.current as HTMLElement,
        (previewRef.current as HTMLElement) || (htmlRef.current as HTMLElement)
      );

      setScrollCb({
        init,
        clear
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    html,
    htmlRef,
    previewRef,
    textAreaRef,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

  // 我们默认，不会发生直接将编辑器切换成预览模式的行为
  // 分栏发生变化时，显示分栏时注册同步滚动，隐藏时清除同步滚动
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }

    return () => {
      scrollCb.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    scrollCb,
    htmlRef,
    previewRef,
    textAreaRef,
    props.scrollAuto,
    props.setting.preview,
    props.setting.htmlPreview
  ]);

  useEffect(() => {
    if (props.setting.preview) {
      // 重新设置复制按钮
      document
        .querySelectorAll(`#${editorId} .${prefix}-preview pre`)
        .forEach((pre: Element) => {
          // 恢复进程ID
          let clearTimer = -1;
          // 移除旧的按钮
          pre.querySelector('.copy-button')?.remove();

          const copyBtnText = usedLanguageText.copyCode?.text || '复制代码';
          const copyButton = document.createElement('span');
          copyButton.setAttribute('class', 'copy-button');
          copyButton.dataset.tips = copyBtnText;

          copyButton.innerHTML = `<svg class="${prefix}-icon" aria-hidden="true"><use xlink:href="#${prefix}-icon-copy"></use></svg>`;

          copyButton.addEventListener('click', () => {
            // 多次点击移除上次的恢复进程
            clearTimeout(clearTimer);

            const codeText = (pre.querySelector('code') as HTMLElement).innerText;

            const success = copy(formatCopiedText(codeText));

            const succssTip = usedLanguageText.copyCode?.successTips || '已复制！';
            const failTip = usedLanguageText.copyCode?.failTips || '已复制！';

            copyButton.dataset.tips = success ? succssTip : failTip;

            clearTimer = window.setTimeout(() => {
              copyButton.dataset.tips = copyBtnText;
            }, 1500);
          });
          pre.appendChild(copyButton);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formatCopiedText,
    html,
    props.setting.preview,
    usedLanguageText.copyCode?.failTips,
    usedLanguageText.copyCode?.successTips,
    usedLanguageText.copyCode?.text
  ]);
};

/**
 * 粘贴板配置
 *
 * @param props
 * @param textAreaRef
 */
export const usePasteUpload = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const { editorId, previewOnly } = useContext(EditorContext);

  useEffect(() => {
    // 粘贴板上传
    const pasteHandler = (e: ClipboardEvent) => {
      if (!e.clipboardData) {
        return;
      }

      // 处理文件
      if (e.clipboardData.files.length > 0) {
        const { files } = e.clipboardData;

        bus.emit(
          editorId,
          'uploadImage',
          Array.from(files).filter((file) => {
            return /image\/.*/.test(file.type);
          })
        );

        e.preventDefault();
      }

      // 识别vscode代码
      if (props.autoDetectCode && e.clipboardData.types.includes('vscode-editor-data')) {
        const vscCoodInfo = JSON.parse(e.clipboardData.getData('vscode-editor-data'));

        bus.emit(editorId, 'replace', 'code', {
          mode: vscCoodInfo.mode,
          text: e.clipboardData.getData('text/plain')
        });

        e.preventDefault();
      }
    };

    if (!previewOnly) {
      textAreaRef.current?.addEventListener('paste', pasteHandler);
    }

    // 编辑器卸载时移除相应的监听事件
    return () => {
      if (!previewOnly) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        textAreaRef.current?.removeEventListener('paste', pasteHandler);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.autoDetectCode, textAreaRef]);
};

/**
 * 放大图片
 *
 * @param props 基础属性
 * @param html 编译后的html
 */
export const useZoom = (props: EditorContentProp, html: string) => {
  const { editorId } = useContext(EditorContext);

  useEffect(() => {
    const zoomHander = () => {
      const imgs = document.querySelectorAll(`#${editorId}-preview img[zoom]`);

      const zoom = mediumZoom(imgs, {
        background: '#00000073'
      });

      return () => {
        zoom.detach();
      };
    };

    return zoomHander();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, props.setting]);
};

/**
 * 一些附带的设置
 */
export const useAttach = (textAreaRef: RefObject<HTMLTextAreaElement>) => {
  const { editorId } = useContext(EditorContext);

  bus.on(editorId, {
    name: TEXTAREA_FOCUS,
    callback() {
      textAreaRef.current?.focus();
    }
  });
};
