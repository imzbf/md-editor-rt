import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import mdit from 'markdown-it';
import ImageFiguresPlugin from 'markdown-it-image-figures';
import TaskListPlugin from 'markdown-it-task-lists';
import { uuid } from '@vavt/util';
import bus from '~/utils/event-bus';
import { generateCodeRowNumber } from '~/utils';
import { HeadList, MarkdownItConfigPlugin, Themes } from '~/type';
import { configOption, prefix } from '~/config';
import {
  BUILD_FINISHED,
  CATALOG_CHANGED,
  PUSH_CATALOG,
  RERENDER
} from '~/static/event-name';

import useHighlight from './useHighlight';
import useMermaid from './useMermaid';
import useKatex from './useKatex';

import MermaidPlugin from '../markdownIt/mermaid';
import KatexPlugin from '../markdownIt/katex';
import AdmonitionPlugin from '../markdownIt/admonition';
import HeadingPlugin from '../markdownIt/heading';
import CodePlugin from '../markdownIt/code';
import XSSPlugin from '../markdownIt/xss';
import { EditorContext } from '~/Editor';
import { ContentPreviewProps } from '../props';

const initLineNumber = (md: mdit) => {
  md.core.ruler.push('init-line-number', (state) => {
    state.tokens.forEach((token) => {
      if (token.map) {
        if (!token.attrs) {
          token.attrs = [];
        }
        token.attrs.push(['data-line', token.map[0].toString()]);
      }
    });
    return true;
  });
};

const useMarkdownIt = (props: ContentPreviewProps, previewOnly: boolean) => {
  const {
    modelValue,
    sanitize,
    mdHeadingId,
    codeFoldable,
    autoFoldThreshold,
    noKatex,
    noMermaid,
    noHighlight,
    setting,
    onHtmlChanged,
    onGetCatalog
  } = props;
  const { editorConfig, markdownItConfig, markdownItPlugins } = configOption;
  //
  const { editorId, language, showCodeRowNumber, theme, usedLanguageText, customIcon } =
    useContext(EditorContext);

  const headsRef = useRef<HeadList[]>([]);

  const themeRef = useRef<Themes>(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const usedLanguageTextRef = useRef(usedLanguageText);
  useEffect(() => {
    usedLanguageTextRef.current = usedLanguageText;
  }, [usedLanguageText]);

  const customIconRef = useRef(customIcon);
  useEffect(() => {
    customIconRef.current = customIcon;
  }, [customIcon]);

  const { hljsRef, hljsInited } = useHighlight(props);
  const { katexRef, katexInited } = useKatex(props);
  const { reRender, replaceMermaid } = useMermaid(props);

  const [md] = useState(() => {
    const md_ = mdit({
      html: true,
      breaks: true,
      linkify: true
    });

    markdownItConfig!(md_, {
      editorId
    });

    const plugins: MarkdownItConfigPlugin[] = [
      {
        type: 'image',
        plugin: ImageFiguresPlugin,
        options: { figcaption: true, classes: 'md-zoom' }
      },
      {
        type: 'admonition',
        plugin: AdmonitionPlugin,
        options: {}
      },
      {
        type: 'taskList',
        plugin: TaskListPlugin,
        options: {}
      },
      {
        type: 'heading',
        plugin: HeadingPlugin,
        options: { mdHeadingId, headsRef }
      },
      {
        type: 'code',
        plugin: CodePlugin,
        options: {
          editorId,
          usedLanguageTextRef,
          // showCodeRowNumber,
          codeFoldable,
          autoFoldThreshold,
          customIconRef
        }
      },
      {
        type: 'xss',
        plugin: XSSPlugin,
        options: {}
      }
    ];

    if (!noKatex) {
      plugins.push({
        type: 'katex',
        plugin: KatexPlugin,
        options: { katexRef }
      });
    }

    if (!noMermaid) {
      plugins.push({
        type: 'mermaid',
        plugin: MermaidPlugin,
        options: { themeRef }
      });
    }

    markdownItPlugins!(plugins, {
      editorId
    }).forEach((item) => {
      md_.use(item.plugin, item.options);
    });

    const userDefHighlight = md_.options.highlight;

    md_.set({
      highlight: (str, language, attrs) => {
        if (userDefHighlight) {
          const result = userDefHighlight(str, language, attrs);
          if (result) {
            return result;
          }
        }

        let codeHtml;

        // 不高亮或者没有实例，返回默认
        if (!noHighlight && hljsRef.current) {
          const hljsLang = hljsRef.current.getLanguage(language);
          if (hljsLang) {
            codeHtml = hljsRef.current.highlight(str, {
              language,
              ignoreIllegals: true
            }).value;
          } else {
            codeHtml = hljsRef.current.highlightAuto(str).value;
          }
        } else {
          codeHtml = md.utils.escapeHtml(str);
        }

        const codeSpan = showCodeRowNumber
          ? generateCodeRowNumber(codeHtml.replace(/^\n+|\n+$/g, ''))
          : `<span class="${prefix}-code-block">${codeHtml.replace(/^\n+|\n+$/g, '')}</span>`;

        return `<pre><code class="language-${language}" language=${language}>${codeSpan}</code></pre>`;
      }
    });

    // if (!previewOnly) {
    initLineNumber(md_);
    // }

    return md_;
  });

  // 文章节点的key
  const [key, setKey] = useState(`_article-key_${uuid()}`);

  const [html, setHtml] = useState(() => {
    return sanitize(md.render(modelValue));
  });

  const needReRender = useMemo(() => {
    return (noHighlight || hljsInited) && (noKatex || katexInited);

    // return (noKatex || katexRef.value) && (noHighlight || hljsRef.value);
  }, [hljsInited, katexInited, noHighlight, noKatex]);

  // 开始已经render一次了，如果提供了实例，那么也正确生成了内容
  // 如果没有提过实例，那么相对来讲第一次useEffect执行一定会快于script的onload
  // 所以忽略多余的一次render
  const ignoreFirstRender = useRef(true);

  const markHtml = useCallback(() => {
    // 清理历史标题
    headsRef.current = [];
    const html_ = sanitize(md.render(modelValue));
    setHtml(html_);
  }, [md, modelValue, sanitize]);

  useEffect(() => {
    // 触发异步的保存事件（html总是会比text后更新）
    bus.emit(editorId, BUILD_FINISHED, html);
    onHtmlChanged?.(html);
    // 传递标题
    onGetCatalog?.(headsRef.current);
    // 生成目录
    bus.emit(editorId, CATALOG_CHANGED, headsRef.current);

    // 手动触发更新时，会更新key，key变化也同步执行上面的任务
  }, [editorId, html, key, onGetCatalog, onHtmlChanged]);

  useEffect(() => {
    if (setting.preview) {
      // 生成目录
      bus.emit(editorId, CATALOG_CHANGED, headsRef.current);
    }
  }, [editorId, setting.preview]);

  useEffect(() => {
    if (ignoreFirstRender.current) {
      ignoreFirstRender.current = false;
      return;
    }

    const timer = setTimeout(
      () => {
        markHtml();
      },
      previewOnly ? 0 : editorConfig.renderDelay
    );

    return () => {
      clearTimeout(timer);
    };
  }, [needReRender, theme, markHtml, language, previewOnly, editorConfig.renderDelay]);

  useEffect(() => {
    replaceMermaid();
  }, [html, key, reRender, replaceMermaid]);

  useEffect(() => {
    const callback = () => {
      bus.emit(editorId, CATALOG_CHANGED, headsRef.current);
    };
    // 添加目录主动触发接收监听
    bus.on(editorId, {
      name: PUSH_CATALOG,
      callback
    });

    return () => {
      bus.remove(editorId, PUSH_CATALOG, callback);
    };
  }, [editorId]);

  useEffect(() => {
    const callback = () => {
      // 强制更新节点
      setKey(`_article-key_${uuid()}`);
      markHtml();
    };
    bus.on(editorId, {
      name: RERENDER,
      callback
    });
    return () => {
      bus.remove(editorId, RERENDER, callback);
    };
  }, [editorId, markHtml]);

  return { html, key };
};

export default useMarkdownIt;
