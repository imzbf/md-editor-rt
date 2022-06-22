import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

import IzPreviewContent from '@/layouts/PreviewContent';

import mdEN from '../../../public/contrast-en-US.md';
import mdCN from '../../../public/contrast-zh-CN.md';

const Contrast = () => {
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
        <IzPreviewContent editorId="md-contrast" modelValue={mdText} />
      </div>
    </div>
  );
};

export default Contrast;
