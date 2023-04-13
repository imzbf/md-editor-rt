import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { marked, Renderer } from 'marked';
import LRUCache from 'lru-cache';
import bus from '~/utils/event-bus';
import { configOption, prefix } from '~/config';
import { EditorContext } from '~/Editor';
import { HeadList, RewriteHeading } from '~/type';
import { isServer } from '~/static/env';
import { generateCodeRowNumber, uuid } from '~/utils';
import { appendHandler, updateHandler } from '~/utils/dom';
import { ContentProps } from '../props';
import useKatex from './useKatex';
import useMermaid from './useMermaid';

import alertExtension from '../marked/alert';
import calcSourceLine, { SourceLine } from '../marked/calcSourceLine';

const useMarked = (props: ContentProps) => {
  const { onHtmlChanged = () => {}, onGetCatalog = () => {} } = props;
  const { editorId, showCodeRowNumber, highlight, previewOnly, theme } =
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

  const [mermaidCache] = useState(() => {
    return new LRUCache({
      max: 1000,
      // 缓存10分钟
      ttl: 600000
    });
  });

  // 编辑区元素和展示区元素的关联数据，用于关联模块同步滚动
  const relatedList = useRef<SourceLine[]>([]);

  const { reRender, mermaidInited } = useMermaid(props);
  const katexInited = useKatex(props, marked);

  // 三个影响编译内容的扩展同时初始化完成后再重新编译
  // 减少编译次数
  const extensionsInited = useMemo(() => {
    return (
      (props.noMermaid || mermaidInited) &&
      highlightInited &&
      (props.noKatex || katexInited)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mermaidInited, highlightInited, katexInited]);

  const renderer = useMemo(() => {
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
            return `<p class="${prefix}-mermaid">${code}</p>`;
          }
          // ==========
          //   客户端
          // ==========
          else {
            // 取缓存
            const cacheSvg = mermaidCache.get(code) as string | undefined;
            if (cacheSvg) {
              return `<p class="${prefix}-mermaid" data-processed>${cacheSvg}</p>`;
            }

            // 主动转换
            const mermaid = mermaidIns || window.mermaid;
            if (mermaidInited) {
              // @9以下使用renderAsync，@10以上使用render
              const render = mermaid.renderAsync || mermaid.render;
              const mermaidRenderTask = render(idRand, code);
              mermaidRenderTask.then((svg: any) => {
                // 9:10
                mermaidCache.set(code, typeof svg === 'string' ? svg : svg.svg);
              });

              mermaidTasks.current.push(mermaidRenderTask);
            } else {
              // 这块图源码不会正确展示在页面上
              return `<p class="${prefix}-mermaid">${code}</p>`;
            }
          }

          const mermaidTemplate = `<script type="text/tmplate">${idRand}</script>`;

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
            ? generateCodeRowNumber(codeHtml.trim())
            : `<span class="code-block">${codeHtml.trim()}</span>`;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensionsInited]);

  // 添加highlight扩展
  useEffect(() => {
    let highlightScript: HTMLScriptElement;

    const highlightLink: HTMLLinkElement = document.createElement('link');
    highlightLink.rel = 'stylesheet';
    highlightLink.href = highlight.css;
    highlightLink.id = `${prefix}-hlCss`;

    appendHandler(highlightLink);

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
              ? generateCodeRowNumber(codeHtml.trim())
              : `<span class="code-block">${codeHtml.trim()}</span>`;
          }
        });

        setHighlightInited(true);
      };

      highlightScript = document.createElement('script');
      highlightScript.src = highlight.js;
      highlightScript.onload = highlightLoad;
      highlightScript.id = `${prefix}-hljs`;

      appendHandler(highlightScript, 'hljs');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateHandler(`${prefix}-hlCss`, 'href', highlight.css);
  }, [highlight.css]);

  // ---预览代码---
  const [html, setHtml] = useState(() => {
    const tokenList = marked.lexer(props.value);
    relatedList.current = calcSourceLine(tokenList);
    return props.sanitize(marked(props.value || '', { renderer }));
  });

  /**
   * 手动替换占位符
   */
  const asyncReplace = async (value: string) => {
    /**
     * 未处理占位符的html
     */
    // console.time(`${editorId}-asyncReplace`);
    const tokenList = marked.lexer(value, { renderer });
    relatedList.current = calcSourceLine(tokenList);
    let unresolveHtml = props.sanitize(marked(value, { renderer }));

    const mermaidIdsCopy = [...mermaidIds.current];
    const mermaidTasksCopy = [...mermaidTasks.current];
    // 移除占位信息
    mermaidIds.current = [];
    mermaidTasks.current = [];
    const taskResults = await Promise.allSettled(mermaidTasksCopy);
    taskResults.forEach((r, index) => {
      // 正常完成，替换模板
      if (r.status === 'fulfilled') {
        unresolveHtml = unresolveHtml.replace(
          mermaidIdsCopy[index],
          `<p class="${prefix}-mermaid" data-processed>${
            typeof r.value === 'string' ? r.value : r.value.svg
          }</p>`
        );
      } else {
        unresolveHtml = unresolveHtml.replace(
          mermaidIdsCopy[index],
          `<p class="${prefix}-mermaid-error">${r.reason || ''}</p>`
        );
      }
    });

    // console.timeEnd(`${editorId}-asyncReplace`);
    return unresolveHtml;
  };

  // mermaid每次生成的style会跟主题绑定
  useEffect(() => {
    mermaidCache.clear();
    // mermaidCache永远不会变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        heads.current = [];
        asyncReplace(props.value || '').then((resolveHtml) => {
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
  }, [props.value, renderer, reRender]);

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

  return { html, relatedList };
};

export default useMarked;
