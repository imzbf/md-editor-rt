import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  MdEditor,
  NormalToolbar,
  DropdownToolbar,
  ModalToolbar,
  MdCatalog,
  config,
  ExposeParam
} from '~~/index';
// import Editor from '../../lib/md-editor-rt.es';
import mdText from '../data.md';
import { Theme } from '../App';
// import TargetBlankExtension from './image/TargetBlankExtension.js';
// import '../../lib/style.css';

import './index.less';
import '~/styles/style.less';
import Icon from '~/components/Icon';
// import { Extension } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
import { CompletionSource } from '@codemirror/autocomplete';
// import screenfull from 'screenfull';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';

// import Cropper from 'cropperjs';
// import 'cropperjs/dist/cropper.css';
// import mermaid from 'mermaid';

// import highlight from 'highlight.js';
// import 'highlight.js/styles/tokyo-night-dark.css';

// import prettier from 'prettier';
// import parserMarkdown from 'prettier/parser-markdown';

// import { cdnBase } from '../../MdEditor/config';

config({
  codeMirrorExtensions(theme, extensions) {
    // console.log(theme, extensions, keyBindings);

    // return extensions;
    return [...extensions, lineNumbers()];
  },
  // iconfontType: 'class',
  // markdownItConfig: (mdit) => {
  // mdit.use(ancher, {
  //   permalink: true
  // });
  // mdit.use(TargetBlankExtension);
  // },
  // markdownItPlugins(plugins) {
  //   console.log(plugins);
  //   return [];
  // },
  editorExtensions: {
    //     prettier: {
    //       prettierInstance: prettier,
    //       parserMarkdownInstance: parserMarkdown
    //     },
    // highlight: {
    // instance: highlight
    //     // css: {
    //     //   'tokyo-night': {
    //     //     light: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-light.min.css`,
    //     //     dark: `${cdnBase}/highlight.js/11.5.1/styles/tokyo-night-dark.min.css`
    //     //   }
    //     // }
    // }
    //     screenfull: {
    //       instance: screenfull
    //     },
    //     katex: {
    //       instance: katex
    //     },
    //     cropper: {
    //       instance: Cropper
    //     },
    // mermaid: {
    //   instance: mermaid
    // }
  }
  //   editorConfig: {
  //     mermaidTemplate: {
  //       /**
  //        * 流程图
  //        */
  //       flow: 'flow',
  //       /**
  //        * 时序图
  //        */
  //       sequence: 'sequence',
  //       /**
  //        * 甘特图
  //        */
  //       gantt: 'gantt',
  //       /**
  //        * 类图
  //        */
  //       class: 'class',
  //       /**
  //        * 状态图
  //        */
  //       state: 'state',
  //       /**
  //        * 饼图
  //        */
  //       pie: 'pie',
  //       /**
  //        * 关系图
  //        */
  //       relationship: 'relationship',
  //       /**
  //        * 旅程图
  //        */
  //       journey: 'journey'
  //     }
  //   }
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
  const editorRef = useRef<ExposeParam>();

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

  const [completions, setCompletions] = useState<Array<CompletionSource>>([]);

  useEffect(() => {
    setTimeout(() => {
      setCompletions(() => {
        return [
          (context) => {
            const word = context.matchBefore(/^>\s*/);

            if (word === null || (word.from == word!.to && context.explicit)) {
              return null;
            }

            return {
              from: word.from,
              options: [
                {
                  label: '> ',
                  type: 'text'
                }
              ]
            };
          }
        ];
      });
    }, 5000);
  }, []);

  useEffect(() => {
    editorRef.current?.on('preview', (status) => {
      console.log('preview', status);
    });

    editorRef.current?.on('htmlPreview', (status) => {
      console.log('htmlPreview', status);
    });

    editorRef.current?.on('pageFullscreen', (status) => {
      console.log('pageFullscreen', status);
    });

    editorRef.current?.on('fullscreen', (status) => {
      console.log('fullscreen', status);
    });

    editorRef.current?.on('catalog', (status) => {
      console.log('catalog', status);
    });
  }, []);

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
        <MdCatalog
          theme={theme}
          editorId="md-editor-preview"
          mdHeadingId={markedHeadingId}
        />
      </div>
      <button
        style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          zIndex: 1000000
        }}
        onClick={() => {
          // editorRef.current?.toggleFullscreen();
          // editorRef.current?.togglePageFullscreen();
          // editorRef.current?.toggleCatalog();
          // editorRef.current?.toggleHtmlPreview();
          // editorRef.current?.togglePreview();
          // editorRef.current?.triggerSave();
          // editorRef.current?.insert((selectedText) => {
          //   return {
          //     targetValue: `@${selectedText}@`,
          //     select: false,
          //     deviationStart: 0,
          //     deviationEnd: 0
          //   };
          // });
          editorRef.current?.focus({
            rangeAnchor: 1000,
            rangeHead: 1001,
            cursorPos: 1003
          });
        }}
      >
        1
      </button>
      <div className="container">
        <MdEditor
          completions={completions}
          ref={editorRef}
          theme={theme}
          language={lang}
          previewTheme={previewTheme}
          codeTheme={codeTheme}
          modelValue={md.text}
          // pageFullscreen
          // preview={false}
          // htmlPreview
          // toolbarsExclude={['github']}
          // noPrettier
          // tabWidth={4}
          showCodeRowNumber
          // tableShape={[10, 10]}
          // noMermaid
          // placeholder="placeholder"
          // noKatex
          mdHeadingId={markedHeadingId}
          // sanitize={(h) => `<a href="#">aaa</a>${h}`}
          // scrollAuto={false}
          // noIconfont
          // codeStyleReverse={false}
          // codeStyleReverseList={['mk-cute']}
          // autoFocus
          // disabled
          // readOnly={true}
          // maxLength={10}
          // noHighlight
          // autoDetectCode
          // onHtmlChanged={console.log}
          // onBlur={console.log}
          // onFocus={console.log}
          editorId="md-editor-preview"
          // showToolbarName
          // onInput={console.log}
          // onError={console.log}
          // noImgZoomIn
          // customIcon={{
          //   bold: {
          //     component: 'A',
          //     props: {}
          //   },
          //   copy: '<i class="fa fa-car"></i>',
          //   preview: {
          //     component: '<i class="fa fa-car"></i>',
          //     props: {
          //       name: 'copy'
          //     }
          //   },
          //   github: {
          //     component: Icon,
          //     props: {
          //       name: 'italic'
          //     }
          //   }
          // }}
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
            <NormalToolbar
              trigger={<Icon name="strike-through" />}
              onClick={console.log}
              key="dddd"
            ></NormalToolbar>,
            <DropdownToolbar
              visible={defVisible}
              trigger={<Icon name="strike-through" />}
              onChange={setDefVisible}
              overlay={<div>下拉内容</div>}
              key="dddd3"
            ></DropdownToolbar>,
            <ModalToolbar
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
              trigger={<Icon name="strike-through" />}
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
            </ModalToolbar>
          ]}
          onSave={(v, h) => {
            console.log('onSave');
            h.then((html) => {
              console.log('onSaveAsync', html);
            });
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
          footers={['markdownTotal', '=', 0, 'scrollSwitch']}
          defFooters={[<span key={'dev-footer-demo'}>^_^</span>]}
        />
        <br />
        {/* <MdEditor
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
        /> */}
        <br />
        <span className="tips-text">
          tips：本页上方的编辑器有localstorage保存功能，可手动点击保存触发，每次操作后两秒会自己保存一次，可用于一些文档的编辑。下方的文档内容也是使用该编辑器完成~
        </span>
      </div>
    </div>
  );
};
