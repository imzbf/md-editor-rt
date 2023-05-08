import React from 'react';
import Editor from '~/Editor';
import { Theme } from '../App';
import mdText from '../data.md';

interface PreviewOnlyProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
}

const PreviewOnly = (props: PreviewOnlyProp) => {
  return (
    <div className="doc">
      <div className="container">
        <Editor
          theme={props.theme}
          previewTheme={props.previewTheme}
          codeTheme={props.codeTheme}
          modelValue={mdText}
          previewOnly
          showCodeRowNumber
        />
      </div>
    </div>
  );
};

export default PreviewOnly;
