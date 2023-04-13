import mdit from 'markdown-it';
import ImageFiguresPlugin from 'markdown-it-image-figures';
import TaskListPlugin from 'markdown-it-task-lists';

import bus from '~/utils/event-bus';
import { generateCodeRowNumber } from '~/utils';
import { HeadList, Themes } from '~/type';
import { configOption } from '~/config';

import { ContentProps } from '../props';
import useHighlight from './useHighlight';
import useMermaid from './useMermaid';
import useKatex from './useKatex';

import MermaidPlugin from '../markdownIt/mermaid';
import KatexPlugin from '../markdownIt/katex';
import AdmonitionPlugin from '../markdownIt/admonition';
import HeadingPlugin from '../markdownIt/heading';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { EditorContext } from '~/Editor';

const addCodeLanguageAttr = (html: string) => {
  return html.replace(
    /<pre><code\sclass="language-([^>]*)">/g,
    '<pre><code class="language-$1" language="$1">'
  );
};

const useMarkdownIt = (props: ContentProps) => {
  const { onHtmlChanged = () => {}, onGetCatalog = () => {} } = props;
  const { editorConfig, markdownItConfig } = configOption;
  //
  const { editorId, showCodeRowNumber, previewOnly, theme } = useContext(EditorContext);

  const headsRef = useRef<HeadList[]>([]);

  const themeRef = useRef<Themes>(theme);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);

  const hljsRef = useHighlight(props);
  const katexRef = useKatex(props);
  const { reRenderRef, replaceMermaid } = useMermaid(props);

  const [md] = useState(() => {
    const md_ = mdit({
      html: true,
      breaks: true
    });

    md_.use(MermaidPlugin, { themeRef });
    md_.use(KatexPlugin, { katexRef });
    md_.use(ImageFiguresPlugin, { figcaption: true });
    md_.use(AdmonitionPlugin);
    md_.use(TaskListPlugin);
    md_.use(HeadingPlugin, { mdHeadingId: props.mdHeadingId, headsRef });

    md_.renderer.rules.paragraph_open = md_.renderer.rules.table_open = (
      tokens,
      idx,
      options,
      _env,
      self
    ) => {
      let line;
      if (tokens[idx].map && tokens[idx].level === 0) {
        line = tokens[idx].map![0];
        tokens[idx].attrSet('data-line', String(line));
      }
      return self.renderToken(tokens, idx, options);
    };

    md_.set({
      highlight: (str, language) => {
        // 不高亮或者没有实例，返回默认
        if (props.noHighlight) {
          return str;
        }
        if (!hljsRef.current) {
          return str;
        }

        // 如果是mermaid

        const hljsLang = hljsRef.current.getLanguage(language);
        let codeHtml;
        if (hljsLang) {
          codeHtml = hljsRef.current.highlight(str, {
            language,
            ignoreIllegals: true
          }).value;
        } else {
          codeHtml = hljsRef.current.highlightAuto(str).value;
        }

        // console.log(str, language);

        return showCodeRowNumber
          ? generateCodeRowNumber(codeHtml.trim())
          : `<span class="code-block">${codeHtml.trim()}</span>`;
      }
    });

    markdownItConfig!(md_);

    return md_;
  });

  const html = useRef(props.sanitize(addCodeLanguageAttr(md.render(props.value))));

  const needReRender = useMemo(() => {
    return props.noHighlight || hljsRef.current;

    // return (props.noKatex || katexRef.value) && (props.noHighlight || hljsRef.value);
  }, [hljsRef, props.noHighlight]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        // 清理历史标题
        headsRef.current = [];
        html.current = props.sanitize(addCodeLanguageAttr(md.render(props.value)));
        // 触发异步的保存事件（html总是会比text后更新）
        bus.emit(editorId, 'buildFinished', html.current);
        onHtmlChanged(html.current);
        // 传递标题
        onGetCatalog(headsRef.current);
        // 生成目录
        bus.emit(editorId, 'catalogChanged', headsRef.current);
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
  }, [props.value, needReRender, reRenderRef, theme]);

  useEffect(() => {
    replaceMermaid();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [html.current]);

  // watch([toRef(props, 'value'), needReRender, reRenderRef], markHtml);

  // 添加目录主动触发接收监听
  useEffect(() => {
    bus.on(editorId, {
      name: 'pushCatalog',
      callback() {
        bus.emit(editorId, 'catalogChanged', headsRef.current);
      }
    });
  });

  return { html };
};

export default useMarkdownIt;
