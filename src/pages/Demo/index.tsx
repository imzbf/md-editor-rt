import React, { useEffect, useState } from 'react';
import Editor, { HeadList } from 'md-editor-rt';
import axios from 'axios';
import { version } from '../../../package.json';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
import { Affix } from 'antd';
import Catalog from '@/components/Catalog';

export default () => {
  const [mdText, setMdText] = useState('');
  const [catalogList, setList] = useState<Array<HeadList>>([]);
  const state = useSelector<StateType>((state) => state) as StateType;

  const queryMd = () => {
    axios
      .get(`/demo-${state.lang}.md`)
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
            theme={state.theme}
            language={state.lang}
            modelValue={mdText}
            previewTheme={state.previewTheme}
            previewOnly
            showCodeRowNumber
            onGetCatalog={(arr) => {
              setList(arr);
            }}
          />
        </div>
        <div className="catalog">
          <Affix offsetTop={16}>
            <Catalog heads={catalogList} />
          </Affix>
        </div>
      </div>
    </div>
  );
};
