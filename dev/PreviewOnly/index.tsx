import React, { useCallback, useRef, useState } from 'react';
import { ExposePreviewParam, MdPreview, prefix } from '~~/index';
import { Theme } from '../App';
import mdText from '../data.md';

// import '~/styles/preview.less';

const editorId = 'preview-only-test';

interface PreviewOnlyProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
  lang: 'zh-CN' | 'en-US';
}

const PreviewOnly = (props: PreviewOnlyProp) => {
  const previewRef = useRef<ExposePreviewParam>();

  const [value, setValue] = useState(mdText);

  const onRemount = useCallback(() => {
    document
      .querySelectorAll(`#${editorId} .${prefix}-preview .${prefix}-code`)
      .forEach((codeBlock: Element) => {
        const tools = codeBlock.querySelectorAll('.extra-code-tools');
        tools.forEach((item) => {
          item.addEventListener('click', (e) => {
            e.preventDefault();

            const activeCode =
              codeBlock.querySelector('input:checked + pre code') ||
              codeBlock.querySelector('pre code');

            const codeText = (activeCode as HTMLElement).textContent!;

            console.log(codeText);
          });
        });
      });
  }, []);

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
          id={editorId}
          ref={previewRef}
          language={props.lang}
          theme={props.theme}
          previewTheme={props.previewTheme}
          codeTheme={props.codeTheme}
          value={value}
          onChange={setValue}
          showCodeRowNumber
          onRemount={onRemount}
        />
      </div>
    </div>
  );
};

export default PreviewOnly;
