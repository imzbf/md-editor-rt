import React, { useEffect, useState } from 'react';
import axios from '@/utils/request';
import Editor from 'md-editor-rt';
import { mdText, mdEnText } from '../../data';

import './index.less';
import { useSelector } from 'react-redux';
import { StateType } from '@/store';

export default () => {
  const [md, setMd] = useState('');

  const state = useSelector((state: any) => state) as StateType;

  useEffect(() => {
    if (state.lang === 'zh-CN') {
      setMd(mdText);
    } else {
      setMd(mdEnText);
    }
  }, [state.lang]);

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={state.theme}
          previewTheme={state.previewTheme}
          modelValue={md}
          language={state.lang}
          editorId="md-editor-preview"
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
                    .then((res: any) => rev(res))
                    .catch((error: any) => rej(error));
                });
              })
            );

            callback(res.map((item: any) => item.data.url));
          }}
        />
        <br />
        <span className="tips-text">
          {state.lang === 'zh-CN'
            ? 'Tips：本页展示编辑器localstorage存储功能已移除！'
            : 'Tips: The editor in this page can not save text to localstorage now!'}
        </span>
      </div>
    </div>
  );
};
