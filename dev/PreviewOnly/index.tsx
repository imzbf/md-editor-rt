import React, { useRef } from 'react';
import { ExposePreviewParam, MdPreview } from '~~/index';
import { Theme } from '../App';
import mdText from '../data.md';

import '~/styles/preview.less';

interface PreviewOnlyProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
  lang: 'zh-CN' | 'en-US';
}

const PreviewOnly = (props: PreviewOnlyProp) => {
  const previewRef = useRef<ExposePreviewParam>();

  return (
    <div className="doc">
      <button
        onClick={() => {
          previewRef.current?.rerender();
        }}
      >
        按钮
      </button>
      <div className="container">
        <MdPreview
          ref={previewRef}
          language={props.lang}
          theme={props.theme}
          previewTheme={props.previewTheme}
          codeTheme={props.codeTheme}
          modelValue={mdText}
          showCodeRowNumber
        />
      </div>
    </div>
  );
};

export default PreviewOnly;
