import React, { useEffect, useState } from 'react';
import Editor from 'md-editor-rt';
import axios from 'axios';

export default () => {
  const [mdText, setMdText] = useState('');

  return (
    <div className="doc">
      <div className="container">
        {/* <Editor editorId="md-doc" theme={props.theme} modelValue={mdText} previewOnly /> */}
      </div>
    </div>
  );
};
