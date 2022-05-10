import React, { useEffect, useState } from 'react';
import Editor from 'md-editor-rt';
import mdEN from '../../../public/doc-en-US.md';
import mdCN from '../../../public/doc-zh-CN.md';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
import { Affix } from 'antd';
import { replaceVersion } from '@/utils';

const Catalog = Editor.Catalog;

export default () => {
  const [mdText, setMdText] = useState(replaceVersion(mdEN));
  const state = useSelector<StateType>((state) => state) as StateType;

  const queryMd = () => {
    setMdText(replaceVersion(state.lang === 'en-US' ? mdEN : mdCN));
  };

  useEffect(queryMd, [state.lang]);

  return (
    <div className="container">
      <div className="doc">
        <div className="content">
          <Editor
            editorId="doc-preview"
            theme={state.theme}
            language={state.lang}
            modelValue={mdText}
            previewTheme={state.previewTheme}
            previewOnly
            showCodeRowNumber
          />
        </div>
        <div className="catalog">
          <Affix offsetTop={16}>
            <Catalog
              editorId="doc-preview"
              theme={state.theme}
              scrollElement={document.documentElement}
            />
          </Affix>
        </div>
      </div>
    </div>
  );
};
