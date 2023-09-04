import { useEffect, useRef, useState } from 'react';
import { prefix, katexUrl, configOption } from '~/config';
import { appendHandler } from '~/utils/dom';
import { ContentPreviewProps } from '../props';

/**
 * 注册katex扩展到marked
 *
 * @param props 内容组件props
 * @param marked -
 */
const useKatex = (props: ContentPreviewProps) => {
  // 获取相应的扩展配置链接
  const katexConf = configOption.editorExtensions?.katex;
  const katexIns = katexConf?.instance;

  // katex是否加载完成
  const katexRef = useRef(katexIns);
  const [katexInited, setKatexInited] = useState(!!katexIns);

  useEffect(() => {
    // 标签引入katex
    if (!props.noKatex && !katexRef.current) {
      const katexScript = document.createElement('script');

      katexScript.src = katexConf?.js || katexUrl.js;
      katexScript.onload = () => {
        katexRef.current = window.katex;
        setKatexInited(true);
      };
      katexScript.id = `${prefix}-katex`;

      const katexLink = document.createElement('link');
      katexLink.rel = 'stylesheet';
      katexLink.href = katexConf?.css || katexUrl.css;
      katexLink.id = `${prefix}-katexCss`;

      appendHandler(katexScript, 'katex');
      appendHandler(katexLink);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { katexRef, katexInited };
};

export default useKatex;
