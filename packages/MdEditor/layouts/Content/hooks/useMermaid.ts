import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { randomId } from '@vavt/util';
import { prefix, configOption } from '~/config';
import { EditorContext } from '~/context';
import { appendHandler } from '~/utils/dom';
import { mermaidCache } from '~/utils/cache';

import { ContentPreviewProps } from '../props';

/**
 * 注册katex扩展到页面
 *
 */
const useMermaid = (props: ContentPreviewProps) => {
  const { theme, rootRef } = useContext(EditorContext);
  const { noMermaid, sanitizeMermaid } = props;

  const mermaidRef = useRef(configOption.editorExtensions.mermaid!.instance);
  const [reRender, setReRender] = useState(-1);

  const configMermaid = useCallback(() => {
    mermaidCache.clear();
    const mermaid = mermaidRef.current;

    if (!noMermaid && mermaid) {
      mermaid.initialize(
        configOption.mermaidConfig({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default'
        })
      );

      // 严格模式下，如果reRender是boolean型，会执行两次，这是reRender将不会effect
      setReRender((_r) => _r + 1);
    }
  }, [noMermaid, theme]);

  useEffect(configMermaid, [configMermaid]);

  useEffect(() => {
    const { editorExtensions, editorExtensionsAttrs } = configOption;

    if (noMermaid || mermaidRef.current) {
      return;
    }

    // 没有提供实例，引入mermaid
    const jsSrc = editorExtensions.mermaid!.js as string;

    if (/\.mjs/.test(jsSrc)) {
      appendHandler('link', {
        ...editorExtensionsAttrs.mermaid?.js,
        rel: 'modulepreload',
        href: jsSrc,
        id: `${prefix}-mermaid-m`
      });

      import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        jsSrc
      ).then((module) => {
        mermaidRef.current = module.default;
        configMermaid();
      });
    } else {
      appendHandler(
        'script',
        {
          ...editorExtensionsAttrs.mermaid?.js,
          src: jsSrc,
          id: `${prefix}-mermaid`,
          onload() {
            mermaidRef.current = window.mermaid;
            configMermaid();
          }
        },
        'mermaid'
      );
    }
  }, [configMermaid, noMermaid]);

  const replaceMermaid = useCallback(async () => {
    if (!noMermaid && mermaidRef.current) {
      const mermaidSourceEles =
        rootRef!.current?.querySelectorAll<HTMLElement>(`div.${prefix}-mermaid`) || [];

      const svgContainingElement = document.createElement('div');
      const sceWidth =
        document.body.offsetWidth > 1366 ? document.body.offsetWidth : 1366;
      const sceHeight =
        document.body.offsetHeight > 768 ? document.body.offsetHeight : 768;

      svgContainingElement.style.width = sceWidth + 'px';
      svgContainingElement.style.height = sceHeight + 'px';
      svgContainingElement.style.position = 'fixed';
      svgContainingElement.style.zIndex = '-10000';
      svgContainingElement.style.top = '-10000';

      let count = mermaidSourceEles.length;

      if (count > 0) {
        document.body.appendChild(svgContainingElement);
      }

      await Promise.allSettled(
        Array.from(mermaidSourceEles).map((ele) => {
          const handler = async (item: HTMLElement) => {
            let mermaidHtml = mermaidCache.get(item.innerText) as string;

            if (!mermaidHtml) {
              const idRand = randomId();
              let result: { svg: string } = { svg: '' };
              try {
                result = await mermaidRef.current.render(
                  idRand,
                  item.innerText,
                  svgContainingElement
                );

                mermaidHtml = await sanitizeMermaid!(result.svg);

                const p = document.createElement('p');
                p.className = `${prefix}-mermaid`;
                p.setAttribute('data-processed', '');
                p.innerHTML = mermaidHtml;
                p.children[0]?.removeAttribute('height');

                mermaidCache.set(item.innerText, p.innerHTML);

                if (item.dataset.line !== undefined) {
                  p.dataset.line = item.dataset.line;
                }

                item.replaceWith(p);
              } catch {
                // console.error(error.message);
              }

              if (--count === 0) {
                svgContainingElement.remove();
              }
            }
          };

          return handler(ele);
        })
      );
    }
  }, [noMermaid, rootRef, sanitizeMermaid]);

  return { mermaidRef, reRender, replaceMermaid };
};

export default useMermaid;
