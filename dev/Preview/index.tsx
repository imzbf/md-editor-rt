import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Editor from '../../MdEditor/Editor';
// import Editor from '../../lib/md-editor-rt.es';
import mdText from '../data.md';
import { Theme } from '../App';
// import '../../lib/style.css';

import './index.less';

import screenfull from 'screenfull';
import katex from 'katex';
import 'katex/dist/katex.min.css';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';
import mermaid from 'mermaid';

import { cdnBase } from '../../MdEditor/config';

Editor.config({
  markedRenderer(renderer) {
    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };

    renderer.image = (href: string, _: string, desc: string) => {
      return `<img src="${href}" alt="${desc}">`;
    };

    return renderer;
  },
  editorExtensions: {
    highlight: {
      css: {
        'tokyo-night': {
          light: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-light.min.css`,
          dark: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-dark.min.css`
        }
      }
    },
    screenfull: {
      instance: screenfull
    },
    katex: {
      instance: katex
    },
    cropper: {
      instance: Cropper
    },
    mermaid: {
      instance: mermaid
    }
  }
});

const SAVE_KEY = 'XHMPGLJIZTDB';

interface PreviewProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
}

export default ({ theme, previewTheme, codeTheme }: PreviewProp) => {
  const [md, setMd] = useState(() => {
    return localStorage.getItem(SAVE_KEY) || mdText;
  });

  const [md2, setMd2] = useState('# Hello World');

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
      <div
        style={{
          width: '200px',
          padding: '10px',
          border: '1px solid #666',
          position: 'fixed',
          right: '10px'
        }}
      >
        <Editor.MdCatalog theme={theme} editorId="md-editor-preview" />
      </div>
      <div className="container">
        <Editor
          theme={theme}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
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
            0,
            1,
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
            <Editor.NormalToolbar
              trigger={
                <svg className={`md-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              }
              onClick={console.log}
              key="dddd"
            ></Editor.NormalToolbar>,
            <Editor.DropdownToolbar
              visible={defVisible}
              trigger={
                <svg className={`md-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              }
              onChange={setDefVisible}
              overlay={<div>下拉内容</div>}
              key="dddd3"
            ></Editor.DropdownToolbar>
          ]}
          onSave={(v) => {
            localStorage.setItem(SAVE_KEY, v);
          }}
          onChange={(value) => setMd(value)}
          onUploadImg={async (files: Array<File>, callback: (urls: string[]) => void) => {
            const res = await Promise.all(
              files.map((file) => {
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
        <Editor
          theme={theme}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          modelValue={md2}
          editorId="md-editor-preview-2"
          onChange={setMd2}
        />
        <br />
        <span className="tips-text">
          tips：本页上方的编辑器有localstorage保存功能，可手动点击保存触发，每次操作后两秒会自己保存一次，可用于一些文档的编辑。下方的文档内容也是使用该编辑器完成~
        </span>
      </div>
    </div>
  );
};
