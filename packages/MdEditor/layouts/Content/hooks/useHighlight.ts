import { useContext, useEffect, useRef, useState } from 'react';
import { prefix, configOption } from '~/config';
import { EditorContext } from '~/Editor';
import { appendHandler, createHTMLElement, updateHandler } from '~/utils/dom';
import { ContentPreviewProps } from '../props';

/**
 * 注册代码高亮扩展到页面
 *
 * @param props 内容组件props
 */
const useHighlight = (props: ContentPreviewProps) => {
  const { highlight } = useContext(EditorContext);

  // hljs是否已经提供
  const hljsRef = useRef(configOption.editorExtensions.highlight!.instance);
  const [hljsInited, setHljsInited] = useState(!!hljsRef.current);

  useEffect(() => {
    updateHandler(
      createHTMLElement('link', {
        ...highlight.css,
        rel: 'stylesheet',
        id: `${prefix}-hlCss`
      })
    );
  }, [highlight.css]);

  useEffect(() => {
    // 强制不高亮，则什么都不做
    if (props.noHighlight || hljsRef.current) {
      return;
    }

    const highlightScript = createHTMLElement('script', {
      ...highlight.js,
      id: `${prefix}-hljs`,
      onload() {
        hljsRef.current = window.hljs;
        setHljsInited(true);
      }
    });

    const highlightLink = createHTMLElement('link', {
      ...highlight.css,
      rel: 'stylesheet',
      id: `${prefix}-hlCss`
    });

    appendHandler(highlightLink);
    appendHandler(highlightScript, 'hljs');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hljsRef, hljsInited };
};

export default useHighlight;
