import React, { useEffect, useState } from 'react';
import Editor from '../../MdEditor/Editor';
import { Theme } from '../App';
import axios from 'axios';

export default (props: { theme: Theme }) => {
  const [mdText, setMdText] = useState('');

  useEffect(() => {
    axios
      .get('doc.md')
      .then(({ data }) => {
        setMdText(data);
      })
      .catch((e) => {
        console.log(e);
        setMdText('文档读取失败！');
      });
  }, []);

  return (
    <div className="doc">
      <div className="container">
        <Editor editorId="md-doc" theme={props.theme} modelValue={mdText} previewOnly />
      </div>
    </div>
  );
};
