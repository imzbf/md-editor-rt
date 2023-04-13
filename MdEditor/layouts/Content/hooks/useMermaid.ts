import { useCallback, useContext, useEffect, useState } from 'react';
import { prefix, mermaidUrl, configOption } from '~/config';
import { EditorContext } from '~/Editor';
import { appendHandler } from '~/utils/dom';
import { ContentProps } from '../props';

/**
 * 注册katex扩展到marked
 *
 */
const useMermaid = (props: ContentProps) => {
  const { theme } = useContext(EditorContext);

  const { editorExtensions } = configOption;
  const mermaidConf = editorExtensions?.mermaid;

  const [mermaidData, setMermaidData] = useState({
    reRender: false,
    mermaidInited: false
  });

  const setMermaidTheme = useCallback(() => {
    const mermaid = mermaidConf?.instance || window.mermaid;

    if (!props.noMermaid && mermaid) {
      mermaid.initialize({
        startOnLoad: false,
        theme: theme === 'dark' ? 'dark' : 'default'
      });

      setMermaidData((_s) => ({
        ..._s,
        reRender: !_s.reRender
      }));
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
      const mermaidScript = document.createElement('script');
      mermaidScript.id = `${prefix}-mermaid`;
      const jsSrc = mermaidConf?.js || mermaidUrl;

      if (/\.mjs/.test(jsSrc)) {
        mermaidScript.setAttribute('type', 'module');
        mermaidScript.innerHTML = `import mermaid from "${jsSrc}";window.mermaid=mermaid;document.getElementById('${prefix}-mermaid').dispatchEvent(new Event('load'));`;
      } else {
        mermaidScript.src = jsSrc;
      }
      mermaidScript.onload = () => {
        setMermaidTheme();
        mermaidData.mermaidInited = true;
      };

      appendHandler(mermaidScript, 'mermaid');
    } else {
      // 提供了实例，直接设置
      setMermaidTheme();
      mermaidData.mermaidInited = true;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return mermaidData;
};

export default useMermaid;
