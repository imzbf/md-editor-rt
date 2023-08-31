import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import LRUCache from 'lru-cache';
import { uuid } from '~/utils';
import { prefix, mermaidUrl, configOption } from '~/config';
import { EditorContext } from '~/Editor';
import { appendHandler } from '~/utils/dom';
import { ContentPreviewProps } from '../props';

/**
 * 注册katex扩展到页面
 *
 */
const useMermaid = (props: ContentPreviewProps) => {
  const { theme } = useContext(EditorContext);

  const { editorExtensions } = configOption;
  const mermaidConf = editorExtensions?.mermaid;

  const mermaidRef = useRef(mermaidConf?.instance);
  const [reRender, setReRender] = useState(-1);

  const [mermaidCache] = useState(
    () =>
      new LRUCache({
        max: 1000,
        // 缓存10分钟
        ttl: 600000
      })
  );

  const setMermaidTheme = useCallback(() => {
    mermaidCache.clear();
    const mermaid = mermaidRef.current;

    if (!props.noMermaid && mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default'
      });

      // 严格模式下，如果reRender是boolean型，会执行两次，这是reRender将不会effect
      setReRender((_r) => _r + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(setMermaidTheme, [setMermaidTheme]);

  useEffect(() => {
    if (props.noMermaid) {
      return;
    }

    // 没有提供实例，引入mermaid
    if (!mermaidConf?.instance) {
      const jsSrc = mermaidConf?.js || mermaidUrl;

      if (/\.mjs/.test(jsSrc)) {
        import(
          /* @vite-ignore */
          /* webpackIgnore: true */
          jsSrc
        ).then((module) => {
          mermaidRef.current = module.default;
          setMermaidTheme();
        });
      } else {
        const mermaidScript = document.createElement('script');
        mermaidScript.id = `${prefix}-mermaid`;
        mermaidScript.src = jsSrc;

        mermaidScript.onload = () => {
          mermaidRef.current = window.mermaid;
          setMermaidTheme();
        };

        appendHandler(mermaidScript, 'mermaid');
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const replaceMermaid = useCallback(() => {
    if (!props.noMermaid && mermaidRef.current) {
      const mermaidSourceEles = document.querySelectorAll<HTMLElement>(
        `div.${prefix}-mermaid`
      );

      const svgContainingElement = document.createElement('div');
      svgContainingElement.style.width = document.body.offsetWidth + 'px';
      svgContainingElement.style.height = document.body.offsetHeight + 'px';
      svgContainingElement.style.position = 'fixed';
      svgContainingElement.style.zIndex = '-10000';
      svgContainingElement.style.top = '-10000';

      let count = mermaidSourceEles.length;

      if (count > 0) {
        document.body.appendChild(svgContainingElement);
      }

      mermaidSourceEles.forEach(async (item) => {
        let mermaidHtml = mermaidCache.get(item.innerText) as string;

        if (!mermaidHtml) {
          const idRand = uuid();
          // @9以下使用renderAsync，@10以上使用render
          const render = mermaidRef.current.renderAsync || mermaidRef.current.render;

          let svg: { svg: string } | string = '';
          try {
            svg = await render(idRand, item.innerText, svgContainingElement);
          } catch (error) {
            // console.error(error);
          }

          // 9:10
          mermaidHtml = typeof svg === 'string' ? svg : svg.svg;
          mermaidCache.set(item.innerText, mermaidHtml);
        }

        const p = document.createElement('p');
        p.className = `${prefix}-mermaid`;
        p.setAttribute('data-processed', '');
        p.innerHTML = mermaidHtml;

        if (item.dataset.line !== undefined) {
          p.dataset.line = item.dataset.line;
        }

        item.replaceWith(p);

        if (--count === 0) {
          svgContainingElement.remove();
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { mermaidRef, reRender, replaceMermaid };
};

export default useMermaid;
