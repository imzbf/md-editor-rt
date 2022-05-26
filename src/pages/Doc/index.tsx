import React, { useEffect, useState } from 'react';
import MdEditor from 'md-editor-rt';
import mdEN from '../../../public/doc-en-US.md';
import mdCN from '../../../public/doc-zh-CN.md';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

export default () => {
  const state = useSelector<StateType>((state) => state) as StateType;

  const [mdText, setMdText] = useState(() => {
    return state.lang === 'zh-CN' ? mdCN : mdEN;
  });

  const queryMd = () => {
    setMdText(state.lang === 'en-US' ? mdEN : mdCN);
  };

  useEffect(queryMd, [state.lang]);

  return (
    <div className="container">
      <div className="doc">
        <div className="content">
          <MdEditor
            editorId="doc-preview"
            theme={state.theme}
            codeTheme={state.codeTheme}
            language={state.lang}
            modelValue={mdText}
            previewTheme={state.previewTheme}
            previewOnly
            showCodeRowNumber
          />
        </div>
        <div className="catalog">
          <div className="affix">
            <MdEditor.MdCatalog
              editorId="doc-preview"
              theme={state.theme}
              scrollElement={document.documentElement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
