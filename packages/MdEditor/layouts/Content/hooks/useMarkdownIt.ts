import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import mdit from 'markdown-it';
import ImageFiguresPlugin from 'markdown-it-image-figures';
import TaskListPlugin from 'markdown-it-task-lists';
import bus from '~/utils/event-bus';
import { generateCodeRowNumber } from '~/utils';
import { HeadList, MarkdownItConfigPlugin, Themes } from '~/type';
import { configOption } from '~/config';
import { BUILD_FINISHED, CATALOG_CHANGED, PUSH_CATALOG } from '~/static/event-name';

import useHighlight from './useHighlight';
import useMermaid from './useMermaid';
import useKatex from './useKatex';

import MermaidPlugin from '../markdownIt/mermaid';
import KatexPlugin from '../markdownIt/katex';
import AdmonitionPlugin from '../markdownIt/admonition';
import HeadingPlugin from '../markdownIt/heading';
import CodeTabsPlugin from '../markdownIt/codetabs';
import { EditorContext } from '~/Editor';
import { ContentPreviewProps } from '../props';

const initLineNumber = (md: mdit) => {
  [
    'paragraph_open',
    'table_open',
    'ordered_list_open',
    'bullet_list_open',
    'blockquote_open',
    'hr',
    'html_block',
    'fence'
  ].forEach((rule) => {
    const backup = md.renderer.rules[rule];

    if (!backup) {
      md.renderer.rules[rule] = (tokens, idx, options, _env, self) => {
        let line;
        if (tokens[idx].map && tokens[idx].level === 0) {
          line = tokens[idx].map![0];
          tokens[idx].attrSet('data-line', String(line));
        }
        return self.renderToken(tokens, idx, options);
      };
    } else {
      md.renderer.rules[rule] = (tokens, idx, options, env, self) => {
        let line;
        const _htmlCode = backup(tokens, idx, options, env, self);

        if (tokens[idx].map && tokens[idx].level === 0) {
          line = tokens[idx].map![0];
          return _htmlCode.replace(/^(<[^>]*)/, `$1 data-line="${line}"`);
        }

        return _htmlCode;
      };
    }
  });
};

const useMarkdownIt = (props: ContentPreviewProps, previewOnly: boolean) => {
  const { onHtmlChanged = () => {}, onGetCatalog = () => {} } = props;
  const { editorConfig, markdownItConfig, markdownItPlugins } = configOption;
  //
  const { editorId, showCodeRowNumber, theme } = useContext(EditorContext);

  const headsRef = useRef<HeadList[]>([]);

  const themeRef = useRef<Themes>(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const { hljsRef, hljsInited } = useHighlight(props);
  const { katexRef, katexInited } = useKatex(props);
  const { reRender, replaceMermaid } = useMermaid(props);

  const [md] = useState(() => {
    const md_ = mdit({
      html: true,
      breaks: true
    });

    markdownItConfig!(md_);

    const plugins: MarkdownItConfigPlugin[] = [
      {
        type: 'katex',
        plugin: KatexPlugin,
        options: { katexRef }
      },
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
        options: { mdHeadingId: props.mdHeadingId, headsRef }
      },
      {
        type: 'codeTabs',
        plugin: CodeTabsPlugin,
        options: { editorId }
      }
    ];

    if (!props.noMermaid) {
      plugins.push({
        type: 'mermaid',
        plugin: MermaidPlugin,
        options: { themeRef }
      });
    }

    markdownItPlugins!(plugins).forEach((item) => {
      md_.use(item.plugin, item.options);
    });

    md_.set({
      highlight: (str, language) => {
        let codeHtml;

        // 不高亮或者没有实例，返回默认
        if (!props.noHighlight && hljsRef.current) {
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
          ? generateCodeRowNumber(codeHtml.trim())
          : `<span class="code-block">${codeHtml.trim()}</span>`;

        return `<pre><code class="language-${language}" language=${language}>${codeSpan}</code></pre>`;
      }
    });

    initLineNumber(md_);

    return md_;
  });

  const [html, setHtml] = useState(() => {
    const html_ = props.sanitize(md.render(props.modelValue));

    return html_;
  });

  const needReRender = useMemo(() => {
    return (props.noHighlight || hljsInited) && (props.noKatex || katexInited);

    // return (props.noKatex || katexRef.value) && (props.noHighlight || hljsRef.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hljsInited, katexInited]);

  // 开始已经render一次了，如果提供了实例，那么也正确生成了内容
  // 如果没有提过实例，那么相对来讲第一次useEffect执行一定会快于script的onload
  // 所以忽略多余的一次render
  const ignoreFirstRender = useRef(true);

  useEffect(() => {
    // 触发异步的保存事件（html总是会比text后更新）
    bus.emit(editorId, BUILD_FINISHED, html);
    onHtmlChanged(html);
    // 传递标题
    onGetCatalog(headsRef.current);
    // 生成目录
    bus.emit(editorId, CATALOG_CHANGED, headsRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html]);

  useEffect(() => {
    if (ignoreFirstRender.current) {
      ignoreFirstRender.current = false;
      return;
    }

    const timer = setTimeout(
      () => {
        // 清理历史标题
        headsRef.current = [];
        const html_ = props.sanitize(md.render(props.modelValue));
        setHtml(html_);

        // // 触发异步的保存事件（html总是会比text后更新）
        // bus.emit(editorId, BUILD_FINISHED, html_);
        // onHtmlChanged(html_);
        // // 传递标题
        // onGetCatalog(headsRef.current);
        // // 生成目录
        // bus.emit(editorId, CATALOG_CHANGED, headsRef.current);
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
  }, [props.modelValue, needReRender, theme]);

  useEffect(() => {
    replaceMermaid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html, reRender]);

  // 添加目录主动触发接收监听
  useEffect(() => {
    bus.on(editorId, {
      name: PUSH_CATALOG,
      callback() {
        bus.emit(editorId, CATALOG_CHANGED, headsRef.current);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { html };
};

export default useMarkdownIt;
