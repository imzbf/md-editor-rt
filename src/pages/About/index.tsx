import React, { useEffect, useState } from 'react';
import MdEditor from 'md-editor-rt';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

import mdEN from '../../../public/about-en-US.md';
import mdCN from '../../../public/about-zh-CN.md';

const About = () => {
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
        <div className="content" style={{ width: '100%' }}>
          <MdEditor
            theme={state.theme}
            codeTheme={state.codeTheme}
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
