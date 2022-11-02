import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import MdEditor from '../../MdEditor/Editor';
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

import highlight from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';

import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';

// import { cdnBase } from '../../MdEditor/config';

MdEditor.config({
  markedRenderer(renderer) {
    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
    };

    renderer.image = (href: string, _: string, desc: string) => {
      return `<img src="${href}" alt="${desc}">`;
    };

    return renderer;
  },
  editorExtensions: {
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    highlight: {
      instance: highlight
      // css: {
      //   'tokyo-night': {
      //     light: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-light.min.css`,
      //     dark: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-dark.min.css`
      //   }
      // }
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
  },
  editorConfig: {
    mermaidTemplate: {
      /**
       * 流程图
       */
      flow: 'flow',
      /**
       * 时序图
       */
      sequence: 'sequence',
      /**
       * 甘特图
       */
      gantt: 'gantt',
      /**
       * 类图
       */
      class: 'class',
      /**
       * 状态图
       */
      state: 'state',
      /**
       * 饼图
       */
      pie: 'pie',
      /**
       * 关系图
       */
      relationship: 'relationship',
      /**
       * 旅程图
       */
      journey: 'journey'
    }
  }
});

const SAVE_KEY = 'XHMPGLJIZTDB';

interface PreviewProp {
  theme: Theme;
  previewTheme: string;
  codeTheme: string;
  lang: 'zh-CN' | 'en-US';
}

const markedHeadingId = (_: string, __: string | number, index: number) =>
  `heading-${index}`;

export default ({ theme, previewTheme, codeTheme, lang }: PreviewProp) => {
  const [md, setMd] = useState(() => {
    return {
      text: localStorage.getItem(SAVE_KEY) || mdText,
      text2: 'Hello world',
      visible: false,
      modalVisible: false,
      isFullscreen: false
    };
  });

  // 自动保存
  const taskId = useRef(-1);
  useEffect(() => {
    clearInterval(taskId.current);
    taskId.current = window.setTimeout(() => {
      localStorage.setItem(SAVE_KEY, md.text);
    }, 2_000);

    return () => {
      clearInterval(taskId.current);
    };
  }, [md.text]);
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
        <MdEditor.MdCatalog
          theme={theme}
          editorId="md-editor-preview"
          markedHeadingId={markedHeadingId}
        />
      </div>
      <div className="container">
        <MdEditor
          theme={theme}
          language={lang}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          modelValue={md.text}
          markedHeadingId={markedHeadingId}
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
            'task',
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
            2,
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
            <MdEditor.NormalToolbar
              trigger={
                <svg className={`md-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              }
              onClick={console.log}
              key="dddd"
            ></MdEditor.NormalToolbar>,
            <MdEditor.DropdownToolbar
              visible={defVisible}
              trigger={
                <svg className={`md-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              }
              onChange={setDefVisible}
              overlay={<div>下拉内容</div>}
              key="dddd3"
            ></MdEditor.DropdownToolbar>,
            <MdEditor.ModalToolbar
              key="ddd-modal"
              title="弹窗扩展"
              modalTitle="外置弹窗"
              showAdjust
              visible={md.modalVisible}
              isFullscreen={md.isFullscreen}
              onAdjust={(isFullscreen) => {
                setMd({
                  ...md,
                  isFullscreen
                });
              }}
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              }
              onClick={() => {
                setMd({
                  ...md,
                  modalVisible: true
                });
              }}
              onClose={() => {
                setMd({
                  ...md,
                  modalVisible: false
                });
              }}
            >
              <div
                style={{
                  width: '500px',
                  height: '300px'
                }}
              ></div>
            </MdEditor.ModalToolbar>
          ]}
          onSave={(v) => {
            localStorage.setItem(SAVE_KEY, v);
          }}
          onChange={(value) =>
            setMd({
              ...md,
              text: value
            })
          }
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
          formatCopiedText={(text: string) => {
            return `${text} \nfrom @imzbf`;
          }}
        />
        <br />
        <MdEditor
          theme={theme}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          modelValue={md.text2}
          editorId="md-editor-preview-2"
          onChange={(value) => {
            setMd({
              ...md,
              text2: value
            });
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
