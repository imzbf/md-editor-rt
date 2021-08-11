import React from 'react';
import Editor from '../../MdEditor/Editor';
import { mdText } from '../data';
import { Theme } from '../App';
import axios from 'axios';

import './index.less';
import { useEffect, useState } from 'react';

const SAVE_KEY = 'XHMPGLJIZTDB';

export default ({ theme }: { theme: Theme }) => {
  const [md, setMd] = useState('');

  // 自动保存
  let taskId = -1;
  useEffect(() => {
    const storagedText = localStorage.getItem(SAVE_KEY) || '';
    setMd(storagedText || mdText);

    taskId = window.setInterval(() => {
      localStorage.setItem(SAVE_KEY, md);
    }, 10_000);

    return () => {
      clearInterval(taskId);
    };
  }, []);

  // -----end-----

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={theme}
          modelValue={md}
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
          tips：本页上方的编辑器有localstorage保存功能，可手动点击保存触发，编辑器每10秒钟会自己保存一次，可用于一些文档的编辑。下方的文档内容也是使用该编辑器完成~
        </span>
      </div>
    </div>
  );
};
