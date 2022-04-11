import React, { useEffect, useState } from 'react';
import Editor from 'md-editor-rt';
import axios from '@/utils/request';
import { version } from '../../../package.json';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
import { Affix } from 'antd';

const Catalog = Editor.Catalog;

export default () => {
  const [mdText, setMdText] = useState('');
  const state = useSelector<StateType>((state) => state) as StateType;

  const queryMd = () => {
    axios
      .get(`/doc-${state.lang}.md`)
      .then(({ data }) => {
        setMdText((data as string).replace(/\$\{EDITOR_VERSION\}/g, version));
      })
      .catch((e) => {
        console.error(e);

        setMdText('文档读取失败！');
      });
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
