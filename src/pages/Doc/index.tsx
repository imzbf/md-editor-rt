import React, { useEffect, useState } from 'react';
import { iconfontSvgUrl, iconfontClassUrl } from 'md-editor-rt';
import mdEN from '../../../public/doc-en-US.md';
import mdCN from '../../../public/doc-zh-CN.md';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

import IzCatalog from '@/layouts/Catalog';
import IzPreviewContent from '@/layouts/PreviewContent';
import { replaceTemplate } from '@/utils';

const editorId = 'doc-preview';

export default () => {
  const state = useSelector<StateType>((state) => state) as StateType;

  const [mdText, setMdText] = useState(() => {
    return replaceTemplate(state.lang === 'zh-CN' ? mdCN : mdEN, {
      iconfontSvgUrl,
      iconfontClassUrl
    });
  });

  const queryMd = () => {
    setMdText(
      replaceTemplate(state.lang === 'zh-CN' ? mdCN : mdEN, {
        iconfontSvgUrl,
        iconfontClassUrl
      })
    );
  };

  useEffect(queryMd, [state.lang]);

  return (
    <div className="container">
      <div className="doc">
        <IzPreviewContent editorId={editorId} modelValue={mdText} />
        <IzCatalog editorId={editorId} />
      </div>
    </div>
  );
};
