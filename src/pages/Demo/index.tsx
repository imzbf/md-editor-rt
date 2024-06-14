import React, { useEffect, useState } from 'react';
import { iconfontSvgUrl, iconfontClassUrl } from 'md-editor-rt';
import { version as EDITOR_VERSION } from '../../../package.json';
import mdEN from '../../../public/demo-en-US.md';
import mdCN from '../../../public/demo-zh-CN.md';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
import { replaceTemplate } from '@/utils';
import IzCatalog from '@/layouts/Catalog';
import IzPreviewContent from '@/layouts/PreviewContent';

const editorId = 'demo-preview';

export default () => {
  const state = useSelector<StateType>((state) => state) as StateType;

  const [mdText, setMdText] = useState(() => {
    return state.lang === 'zh-CN' ? mdCN : mdEN;
  });

  useEffect(() => {
    setMdText(
      replaceTemplate(state.lang === 'en-US' ? mdEN : mdCN, {
        iconfontSvgUrl,
        iconfontClassUrl,
        EDITOR_VERSION
      })
    );
  }, [state.lang]);

  return (
    <div className="container">
      <div className="doc">
        <IzPreviewContent editorId={editorId} modelValue={mdText} />
        <IzCatalog editorId={editorId} />
      </div>
    </div>
  );
};
