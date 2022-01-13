import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '../../MdEditor/Editor';
// import Editor from '../../lib/md-editor-rt.es';
import { mdText } from '../data';
import { Theme } from '../App';
// import '../../lib/style.css';

import './index.less';
const SAVE_KEY = 'XHMPGLJIZTDB';

export default ({ theme }: { theme: Theme }) => {
  const [md, setMd] = useState('');

  useEffect(() => {
    const storagedText = localStorage.getItem(SAVE_KEY) || '';
    setMd(storagedText || mdText);
  }, []);

  // 自动保存
  const taskId = useRef(-1);
  useEffect(() => {
    clearInterval(taskId.current);
    taskId.current = window.setTimeout(() => {
      localStorage.setItem(SAVE_KEY, md);
    }, 2_000);

    return () => {
      clearInterval(taskId.current);
    };
  }, [md]);
  // -----end-----

  const [defVisible, setDefVisible] = useState(false);

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={theme}
          modelValue={md}
          editorId="md-editor-preview"
          toolbars={[
            'bold',
            'underline',
            'italic',
            'strikeThrough',
            '-',
            'title',
            'sub',
            'sup',
            'quote',
            'unorderedList',
            'orderedList',
            '-',
            'codeRow',
            'code',
            'link',
            'image',
            'table',
            'mermaid',
            'katex',
            '-',
            'revoke',
            'next',
            'save',
            '=',
            'prettier',
            'pageFullscreen',
            'fullscreen',
            'preview',
            'htmlPreview',
            'catalog',
            'github',
            'ddd'
          ]}
          defToolbars={[
            {
              type: 'dropdown',
              name: 'my-def',
              trigger: (
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-underline" />
                </svg>
              ),
              visible: defVisible,
              onChange: setDefVisible,
              overlay: (
                <span
                  onClick={() => {
                    console.log(document.querySelector('#md-editor-preview-textarea'));
                  }}
                >
                  哈哈哈
                </span>
              )
            }
          ]}
          onSave={(v) => {
            localStorage.setItem(SAVE_KEY, v);
          }}
          onChange={(value) => setMd(value)}
          onUploadImg={async (files: FileList, callback: (urls: string[]) => void) => {
            const res = await Promise.all(
              Array.from(files).map((file) => {
                return new Promise((rev, rej) => {
                  const form = new FormData();
                  form.append('file', file);

                  axios
                    .post('/api/img/upload', form, {
                      headers: {
                        'Content-Type': 'multipart/form-data'
                      }
                    })
                    .then((res) => rev(res))
                    .catch((error) => rej(error));
                });
              })
            );

            callback(res.map((item: any) => item.data.url));
          }}
        />
        <br />
        <span className="tips-text">
          tips：本页上方的编辑器有localstorage保存功能，可手动点击保存触发，每次操作后两秒会自己保存一次，可用于一些文档的编辑。下方的文档内容也是使用该编辑器完成~
        </span>
      </div>
    </div>
  );
};
