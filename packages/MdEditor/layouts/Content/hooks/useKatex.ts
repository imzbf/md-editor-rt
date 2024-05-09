import { useEffect, useRef, useState } from 'react';
import { prefix, configOption } from '~/config';
import { appendHandler, createHTMLElement } from '~/utils/dom';
import { ContentPreviewProps } from '../props';

/**
 * 注册katex扩展到marked
 *
 * @param props 内容组件props
 * @param marked -
 */
const useKatex = (props: ContentPreviewProps) => {
  // katex是否加载完成
  const katexRef = useRef(configOption.editorExtensions.katex!.instance);
  const [katexInited, setKatexInited] = useState(!!katexRef.current);

  useEffect(() => {
    if (props.noKatex || katexRef.current) {
      return;
    }
    // 标签引入katex

    // 获取相应的扩展配置链接
    const { editorExtensions } = configOption;

    const katexScript = createHTMLElement('script', {
      src: editorExtensions.katex!.js,
      id: `${prefix}-katex`,
      onload() {
        katexRef.current = window.katex;
        setKatexInited(true);
      }
    });

    const katexLink = createHTMLElement('link', {
      rel: 'stylesheet',
      href: editorExtensions.katex!.css,
      id: `${prefix}-katexCss`
    });

    appendHandler(katexScript, 'katex');
    appendHandler(katexLink);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { katexRef, katexInited };
};

export default useKatex;
