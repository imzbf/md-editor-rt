import React, { useEffect, useRef } from 'react';
import Editor from '../../MdEditor/Editor';
import { Theme } from '../App';
import axios from 'axios';

export default (props: { theme: Theme }) => {
  const mdText = useRef('');

  useEffect(() => {
    axios
      .get('doc.md')
      .then(({ data }) => {
        mdText.current = data;
      })
      .catch((e) => {
        console.log(e);

        mdText.current = '文档读取失败！';
      });
  }, []);

  return (
    <div className="doc">
      <div className="container">
        <Editor theme={props.theme} modelValue={mdText.current} previewOnly />
      </div>
    </div>
  );
};
