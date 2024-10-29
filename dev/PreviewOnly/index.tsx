import React, { useRef, useState } from 'react';
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

  const [value, setValue] = useState(mdText);

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
          value={value}
          onChange={setValue}
          showCodeRowNumber
        />
      </div>
    </div>
  );
};

export default PreviewOnly;
