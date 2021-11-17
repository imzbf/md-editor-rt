import React, { useEffect, useState } from 'react';
import Editor from 'md-editor-rt';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
import { version } from '../../../package.json';
import axios from '@/utils/request';

const About = () => {
  const state = useSelector<StateType>((state) => state) as StateType;

  const [mdText, setMdText] = useState('');

  const queryMd = () => {
    axios
      .get(`/about-${state.lang}.md`)
      .then(({ data }: any) => {
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
        <div className="content" style={{ width: '100%' }}>
          <Editor
            theme={state.theme}
            modelValue={mdText}
            previewTheme={state.previewTheme}
            previewOnly
            showCodeRowNumber
          />
        </div>
      </div>
    </div>
  );
};

export default About;
