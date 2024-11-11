import { useContext, useEffect, useRef, useState } from 'react';
import { configOption } from '~/config';
import { EditorContext } from '~/context';
import { appendHandler, updateHandler } from '~/utils/dom';
import { CDN_IDS } from '~/static';
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
    // 强制不高亮，则什么都不做
    if (props.noHighlight || configOption.editorExtensions.highlight!.instance) {
      return;
    }

    updateHandler('link', {
      ...highlight.css,
      rel: 'stylesheet',
      id: CDN_IDS.hlcss
    });
  }, [highlight.css, props.noHighlight]);

  useEffect(() => {
    // 强制不高亮，则什么都不做
    if (props.noHighlight || hljsRef.current) {
      return;
    }

    appendHandler(
      'script',
      {
        ...highlight.js,
        id: CDN_IDS.hljs,
        onload() {
          hljsRef.current = window.hljs;
          setHljsInited(true);
        }
      },
      'hljs'
    );

    // 只执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { hljsRef, hljsInited };
};

export default useHighlight;
