import React, { useEffect, useState } from 'react';
import axios from '@/utils/request';
import Editor from 'md-editor-rt';
import { mdText, mdEnText, emojis } from '../../data';

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

  const [defVisible, setDefVisible] = useState(false);

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          theme={state.theme}
          previewTheme={state.previewTheme}
          modelValue={md}
          language={state.lang}
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
            'emoji',
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
            'github'
          ]}
          defToolbars={[
            {
              type: 'dropdown',
              name: 'emoji',
              trigger: (
                <svg className="icon" aria-hidden="true">
                  <use xlinkHref="#icon-emoji"></use>
                </svg>
              ),
              visible: defVisible,
              onChange: setDefVisible,
              overlay: (
                // <span
                //   onClick={() => {
                //     console.log(document.querySelector('#md-editor-preview-textarea'));
                //   }}
                // >
                //   哈哈哈
                // </span>
                <div className="emoji-container">
                  <ol className="emojis">
                    {emojis.map((emoji, index) => (
                      <li key={`emoji-${index}`}>{emoji}</li>
                    ))}
                  </ol>
                </div>
              ),
              onClick: () => {
                console.log('自定义工具栏被点击');
              }
            }
          ]}
          onChange={(value: string) => setMd(value)}
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
            ? 'Tips：本页展示编辑器localstorage存储功能已移除！本页面的emoji示例需要自行扩展，请参考示例页面中的内容！'
            : 'Tips: The editor in this page can not save text to localstorage now! The function of inserting emoji on this page needs to be developed by yourself! The example is on the "demo" page.'}
        </span>
      </div>
    </div>
  );
};
