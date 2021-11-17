import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Editor from 'md-editor-rt';
import { mdText, mdEnText } from '../../data';

import './index.less';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';
const SAVE_KEY = 'XHMPGLJIZTDB';

export default () => {
  const [md, setMd] = useState('');

  const state = useSelector((state: any) => state) as StateType;

  useEffect(() => {
    const storagedText = localStorage.getItem(SAVE_KEY) || '';

    if (state.lang === 'zh-CN') {
      setMd(storagedText || mdText);
    } else {
      setMd(storagedText || mdEnText);
    }
  }, [state.lang]);

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

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={state.theme}
          previewTheme={state.previewTheme}
          modelValue={md}
          editorId="md-editor-preview"
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
          {state.lang === 'zh-CN'
            ? 'Tips：本页上方的编辑器有localstorage保存功能，每次操作后两秒会自己保存一次，可手动点击保存触发，可用于一些文档的编辑。'
            : 'Tips: The editor in this page will save text to localstorage auto, and you can save text by yourself also. Wish this function can be used to edit some temporary document.'}
        </span>
      </div>
    </div>
  );
};
