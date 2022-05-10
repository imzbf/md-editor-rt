import React, { useEffect, useState } from 'react';
import Editor from 'md-editor-rt';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

import mdEN from '../../../public/about-en-US.md';
import mdCN from '../../../public/about-zh-CN.md';
import { replaceVersion } from '@/utils';

const About = () => {
  const state = useSelector<StateType>((state) => state) as StateType;

  const [mdText, setMdText] = useState(replaceVersion(mdEN));

  const queryMd = () => {
    setMdText(replaceVersion(state.lang === 'en-US' ? mdEN : mdCN));
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
