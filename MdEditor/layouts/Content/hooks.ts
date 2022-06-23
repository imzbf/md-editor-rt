import { RefObject, useContext, useEffect, useRef, useState } from 'react';
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
  debounce
} from '../../utils';
import { directive2flag, ToolDirective } from '../../utils/content-help';
import bus from '../../utils/event-bus';
import { EditorContentProp } from './';
import { EditorContext } from '../../Editor';
import { prefix, katexUrl, mermaidUrl, configOption } from '../../config';
import { appendHandler, updateHandler } from '../../utils/dom';
import kaTexExtensions from '../../utils/katex';

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
  completeStatus: boolean
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

  const keyZCallback = (curr: number) => {
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
  };

  const saveHistory = (content: string) => {
    clearTimeout(saveHistoryId);
    const startPos: number = textAreaRef.current?.selectionStart || 0;
    const endPos: number = textAreaRef.current?.selectionEnd || 0;

    saveHistoryId = <any>setTimeout(() => {
      // 如果不是撤销操作，就记录
      if (history.current.userUpdated) {
        // 重置撤回之前的记录
        if (history.current.curr < history.current.list.length - 1) {
          history.current.list = history.current.list.slice(0, history.current.curr + 1);
        }
        if (history.current.list.length > historyLength) {
          history.current.list.shift();
        }

        // 修改保存上次记录选中定位
        const lastStep = history.current.list.pop() || {
          startPos: 0,
          endPos: 0,
          content
        };

        lastStep.startPos = historyPos.current[0];
        lastStep.endPos = historyPos.current[1];

        // 恢复初始位置历史
        historyPos.current = POSITION_START;

        Array.prototype.push.call(history.current.list, lastStep, {
          content,
          startPos,
          endPos
        });

        // 下标调整为最后一个位置
        history.current.curr = history.current.list.length - 1;
      } else {
        history.current.userUpdated = true;
      }
    }, 150);
  };

  /**
   * @param force 是否强制更新光标历史
   */
  const saveHistoryPos = (force: boolean) => {
    // 如果不是初始值，代表上次记录未插入输入历史
    if (historyPos.current === POSITION_START || force) {
      historyPos.current = [
        textAreaRef.current?.selectionStart || 0,
        textAreaRef.current?.selectionEnd || 0
      ];
    }
  };

  useEffect(() => {
    if (completeStatus) {
      saveHistory(props.value);
    }
  }, [props.value, completeStatus]);

  useEffect(() => {
    // 更新后清除选中内容
    bus.emit(editorId, 'selectTextChange');
  }, [props.value]);

  useEffect(() => {
    bus.on(editorId, {
      name: 'ctrlZ',
      callback() {
        keyZCallback(history.current.curr - 1 < 0 ? 0 : history.current.curr - 1);
      }
    });

    bus.on(editorId, {
      name: 'ctrlShiftZ',
      callback() {
        keyZCallback(
          history.current.curr + 1 === history.current.list.length
            ? history.current.curr
            : history.current.curr + 1
        );
      }
    });

    bus.on(editorId, {
      name: 'saveHistoryPos',
      callback: saveHistoryPos
    });
  }, []);
};

export const useAutoGenrator = (
  props: EditorContentProp,
  textAreaRef: RefObject<HTMLTextAreaElement>
) => {
  const selectedText = useRef('');
  const { previewOnly, tabWidth, editorId } = useContext(EditorContext);

  useEffect(() => {
    if (!previewOnly) {
      textAreaRef.current?.addEventListener('keypress', (event: any) => {
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
            if (/^\d+\.\s+$|^-\s+$/.test(enterPressRow)) {
              const resetPrefixStr = prefixStr?.replace(
                new RegExp(enterPressRow + '$'),
                ''
              );
              props.onChange((resetPrefixStr as string) + subStr);

              // 手动定位光标到当前位置
              setPosition(
                textAreaRef.current as HTMLTextAreaElement,
                resetPrefixStr?.length
              );
            } else if (/^-\s+.+/.test(enterPressRow)) {
              // 无序列表存在内容
              props.onChange(
                insert(textAreaRef.current as HTMLTextAreaElement, '\n- ', {})
              );
            } else {
              const lastOrderMatch = enterPressRow?.match(/\d+(?=\.)/);

              const nextOrder = (lastOrderMatch && Number(lastOrderMatch[0]) + 1) || 1;
              props.onChange(
                insert(textAreaRef.current as HTMLTextAreaElement, `\n${nextOrder}. `, {})
              );
            }
          }
        }
      });

      // 注册修改选择内容事件
      bus.on(editorId, {
        name: 'selectTextChange',
        callback() {
          selectedText.current = getSelectionText(
            textAreaRef.current as HTMLTextAreaElement
          );
        }
      });
    }
  }, []);

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

  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, 'replace', replaceCallBack);

      // 注册指令替换内容事件
      bus.on(editorId, {
        name: 'replace',
        callback: replaceCallBack
      });
    }
  }, [textAreaRef]);

  return {
    selectedText
  };
};

export const useMarked = (props: EditorContentProp) => {
  const { onHtmlChanged = () => {}, onGetCatalog = () => {} } = props;
  const { editorId, usedLanguageText, showCodeRowNumber, highlight, previewOnly } =
    useContext(EditorContext);

  const { markedRenderer, markedOptions, markedExtensions, editorConfig } = configOption;
  const highlightIns = configOption.editorExtensions?.highlight?.instance;
  const mermaidIns = configOption.editorExtensions?.mermaid?.instance;

  // 当页面已经引入完成对应的库时，通过修改从状态完成marked重新编译
  const [highlightInited, setHighlightInited] = useState<boolean>(() => {
    return !!highlightIns;
  });

  const heads = useRef<HeadList[]>([]);
  // const heading: MarkedHeading = (...headProps) => {
  //   const [, level, raw] = headProps;
  //   heads.current.push({ text: raw, level });

  //   return props.markedHeading(...headProps);
  // };

  const [renderer] = useState(() => {
    let renderer = new marked.Renderer();

    const markedCode = renderer.code;
    renderer.code = (code, language, isEscaped) => {
      if (!props.noMermaid && language === 'mermaid') {
        const idRand = `${prefix}-mermaid-${Date.now().toString(36)}`;

        try {
          let svgCode = '';
          // 服务端渲染，如果提供了mermaid，就生成svg
          if (mermaidIns) {
            svgCode = mermaidIns.mermaidAPI.render(idRand, code);
          }
          // 没有提供，则判断window对象是否可用，不可用则反回待解析的结构，在页面引入后再解析
          else if (typeof window !== 'undefined' && window.mermaid) {
            svgCode = window.mermaid.mermaidAPI.render(idRand, code);
          } else {
            // 这块代码不会正确展示在页面上
            svgCode = `<div class="mermaid">${code}</div>`;
          }

          return `<div class="${prefix}-mermaid">${svgCode}</div>`;
        } catch (error) {
          if (typeof document !== 'undefined') {
            const errorDom = document.querySelector(`#${idRand}`);

            if (errorDom) {
              const errorSvg = errorDom.outerHTML;
              errorDom.parentElement?.remove();
              return errorSvg;
            }
          }

          return '';
        }
      }

      return markedCode.call(renderer, code, language, isEscaped);
    };

    renderer.image = (href, title, desc) => {
      return `<span class="figure"><img src="${href}" title="${title || ''}" alt="${
        desc || ''
      }" zoom><span class="figcaption">${desc || ''}</span></span>`;
    };

    renderer.listitem = (text: string, task: boolean) => {
      if (task) {
        return `<li class="li-task">${text}</li>`;
      }
      return `<li>${text}</li>`;
    };

    // 保存默认heading，对比是否更新过
    const markedheading = renderer.heading;

    if (markedRenderer instanceof Function) {
      renderer = markedRenderer(renderer) as Renderer;
    }

    // ========heading========start
    // 判断是否有重写heading
    const newHeading = renderer.heading;
    const isNewHeading = markedheading !== newHeading;

    renderer.heading = (text, level, raw, slugger) => {
      heads.current.push({ text: raw, level });

      // 如果heading被重写了，使用新的heading
      if (isNewHeading) {
        return (newHeading as RewriteHeading).call(
          renderer,
          text,
          level,
          raw,
          slugger,
          heads.current.length
        );
      }

      // return props.markedHeading(...headProps);
      // 我们默认同一级别的标题，你不会定义两个相同的
      const id = props.markedHeadingId(raw, level, heads.current.length);

      // 如果标题有markdown语法内容，会按照该语法添加标题，而不再自定义，但是仍然支持目录定位
      if (text !== raw) {
        return `<h${level} id="${id}">${text}</h${level}>`;
      } else {
        return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
      }
    };
    // ========heading========end

    marked.setOptions({
      breaks: true,
      ...markedOptions
    });

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

    // 自定义的marked扩展
    if (markedExtensions instanceof Array && markedExtensions.length > 0) {
      marked.use({
        extensions: markedExtensions
      });
    }

    return renderer;
  });

  const katexInited = useKatex(props, marked);
  const { reRender, mermaidInited } = useMermaid(props);

  // 向页面代码块注入复制按钮
  const initCopyEntry = () => {
    document
      .querySelectorAll(`#${editorId} .${prefix}-preview pre`)
      .forEach((pre: Element) => {
        const copyBtnText = usedLanguageText.copyCode?.text || '复制代码';
        const copyButton = document.createElement('span');
        copyButton.setAttribute('class', 'copy-button');
        copyButton.innerText = copyBtnText;
        copyButton.addEventListener('click', () => {
          const success = copy((pre.querySelector('code') as HTMLElement).innerText);

          const succssTip = usedLanguageText.copyCode?.successTips || '已复制！';
          const failTip = usedLanguageText.copyCode?.failTips || '已复制！';

          copyButton.innerText = success ? succssTip : failTip;

          setTimeout(() => {
            copyButton.innerText = copyBtnText;
          }, 1500);
        });
        pre.appendChild(copyButton);
      });
  };

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

  // 添加highlight扩展
  useEffect(() => {
    let highlightLink: HTMLLinkElement;
    let highlightScript: HTMLScriptElement;

    if (!highlightIns) {
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
  }, []);

  useEffect(() => {
    updateHandler(`${prefix}-hlCss`, 'href', highlight.css);
  }, [highlight.css]);

  // ---预览代码---
  const [html, setHtml] = useState(() => {
    return props.sanitize(marked(props.value || '', { renderer }));
  });

  useEffect(() => {
    const timer = setTimeout(
      () => {
        heads.current = [];
        const _html = props.sanitize(marked(props.value || '', { renderer }));
        onHtmlChanged(_html);
        setHtml(_html);

        // 传递标题
        onGetCatalog(heads.current);
        // 生成目录，
        bus.emit(editorId, 'catalogChanged', heads.current);
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
  }, [props.value, highlightInited, mermaidInited, reRender, katexInited]);

  // 添加目录主动触发接收监听
  useEffect(() => {
    bus.on(editorId, {
      name: 'pushCatalog',
      callback() {
        bus.emit(editorId, 'catalogChanged', heads.current);
      }
    });
  }, []);

  useEffect(() => {
    // 重新设置复制按钮
    initCopyEntry();
  }, [html]);

  return { html };
};

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
          theme: theme === 'dark' ? 'dark' : 'default'
        });
      } else if (window.mermaid) {
        window.mermaid.initialize({
          theme: theme === 'dark' ? 'dark' : 'default'
        });
      }
      setReRender((_reRender) => !_reRender);
    }
  }, [theme]);

  useEffect(() => {
    let mermaidScript: HTMLScriptElement;
    // 引入mermaid
    if (!props.noMermaid && !mermaidConf?.instance) {
      mermaidScript = document.createElement('script');
      mermaidScript.src = mermaidConf?.js || mermaidUrl;
      mermaidScript.onload = () => {
        window.mermaid.initialize({
          theme: theme === 'dark' ? 'dark' : 'default',
          logLevel: import.meta.env.MODE === 'development' ? 'Error' : 'Fatal'
        });
        setMermaidInited(true);
      };
      mermaidScript.id = `${prefix}-mermaid`;

      appendHandler(mermaidScript, 'mermaid');
    }
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
  }, []);

  return katexInited;
};

export const useAutoScroll = (
  props: EditorContentProp,
  html: string,
  textAreaRef: RefObject<HTMLElement>,
  previewRef: RefObject<HTMLElement>,
  htmlRef: RefObject<HTMLElement>
) => {
  const { previewOnly } = useContext(EditorContext);
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
  }, []);

  // 更新完毕后判断是否需要重新绑定滚动事件
  useEffect(() => {
    if (props.setting.preview && !previewOnly && props.scrollAuto) {
      setTimeout(() => {
        scrollCb.clear();
        scrollCb.init();
      }, 0);
    }
  }, [html]);

  // 我们默认，不会发生直接将编辑器切换成预览模式的行为
  // 分栏发生变化时，显示分栏时注册同步滚动，隐藏时清除同步滚动
  useEffect(() => {
    if (
      (props.setting.preview || props.setting.htmlPreview) &&
      !previewOnly &&
      props.scrollAuto
    ) {
      scrollCb.clear();
      // 需要等到页面挂载完成后再注册，否则不能正确获取到预览dom
      const [init, clear] = scrollAuto(
        textAreaRef.current as HTMLElement,
        (previewRef.current as HTMLElement) || (htmlRef.current as HTMLElement)
      );

      setScrollCb({
        init,
        clear
      });

      init();
    }
  }, [props.setting.preview, props.setting.htmlPreview]);

  // 切换滚动状态时，重新设置同步滚动
  useEffect(() => {
    if (props.scrollAuto) {
      scrollCb.init();
    } else {
      scrollCb.clear();
    }
  }, [props.scrollAuto]);
};

export const usePasteUpload = (textAreaRef: RefObject<HTMLTextAreaElement>) => {
  const { editorId, previewOnly } = useContext(EditorContext);

  // 粘贴板上传
  const pasteHandler = (e: ClipboardEvent) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
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
  };

  useEffect(() => {
    if (!previewOnly) {
      textAreaRef.current?.addEventListener('paste', pasteHandler);
    }

    // 编辑器卸载时移除相应的监听事件
    return () => {
      if (!previewOnly) {
        textAreaRef.current?.removeEventListener('paste', pasteHandler);
      }
    };
  }, []);
};

export const userZoom = (html: string) => {
  const { editorId } = useContext(EditorContext);

  let zoomHander = () => {};

  useEffect(() => {
    zoomHander = debounce(() => {
      const imgs = document.querySelectorAll(`#${editorId}-preview img[zoom]`);

      if (imgs.length === 0) {
        return;
      }

      mediumZoom(imgs, {
        background: '#00000073'
      });
    });

    zoomHander();
  }, [html]);
};
