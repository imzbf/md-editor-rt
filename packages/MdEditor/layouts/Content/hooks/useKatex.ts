import { useEffect, useRef, useState } from 'react';
import { globalConfig } from '~/config';
import { appendHandler } from '~/utils/dom';
import { CDN_IDS } from '~~/MdEditor/static';

import { ContentPreviewProps } from '../props';

/**
 * 注册katex扩展到marked
 *
 * @param props 内容组件props
 * @param marked -
 */
const useKatex = (props: ContentPreviewProps) => {
  // katex是否加载完成
  const katexRef = useRef(globalConfig.editorExtensions.katex!.instance);
  const [katexInited, setKatexInited] = useState(!!katexRef.current);

  useEffect(() => {
    if (props.noKatex || katexRef.current) {
      return;
    }
    // 标签引入katex

    // 获取相应的扩展配置链接
    const { editorExtensions, editorExtensionsAttrs } = globalConfig;

    appendHandler(
      'script',
      {
        ...editorExtensionsAttrs.katex?.js,
        src: editorExtensions.katex!.js,
        id: CDN_IDS.katexjs,
        onload() {
          katexRef.current = window.katex;
          setKatexInited(true);
        }
      },
      'katex'
    );
    appendHandler('link', {
      ...editorExtensionsAttrs.katex?.css,
      rel: 'stylesheet',
      href: editorExtensions.katex!.css,
      id: CDN_IDS.katexcss
    });
  }, [props.noKatex]);

  return { katexRef, katexInited };
};

export default useKatex;
