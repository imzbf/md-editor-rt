import { useContext, useEffect, useRef, useState } from 'react';
import { prefix, configOption } from '~/config';
import { EditorContext } from '~/Editor';
import { appendHandler, updateHandler } from '~/utils/dom';
import { ContentPreviewProps } from '../props';

/**
 * 注册代码高亮扩展到页面
 *
 * @param props 内容组件props
 */
const useHighlight = (props: ContentPreviewProps) => {
  // 获取相应的扩展配置链接
  const hljsConf = configOption.editorExtensions?.highlight;
  const hljs = hljsConf?.instance;
  const { highlight } = useContext(EditorContext);

  // hljs是否已经提供
  const hljsRef = useRef(hljs);
  const [hljsInited, setHljsInited] = useState(!!hljs);

  useEffect(() => {
    updateHandler(`${prefix}-hlCss`, 'href', highlight.css);
  }, [highlight.css]);

  useEffect(() => {
    // 强制不高亮，则什么都不做
    if (props.noHighlight) {
      return;
    }

    if (!hljsRef.current) {
      const highlightScript = document.createElement('script');
      highlightScript.src = highlight.js;
      highlightScript.onload = () => {
        hljsRef.current = window.hljs;
        setHljsInited(true);
      };
      highlightScript.id = `${prefix}-hljs`;
      appendHandler(highlightScript, 'hljs');

      const highlightLink = document.createElement('link');
      highlightLink.rel = 'stylesheet';
      highlightLink.href = highlight.css;
      highlightLink.id = `${prefix}-hlCss`;

      appendHandler(highlightLink);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hljsRef, hljsInited };
};

export default useHighlight;
