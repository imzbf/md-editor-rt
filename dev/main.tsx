import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { config, editorExtensionsAttrs } from '~~/index';

// import Editor from '../../lib/md-editor-rt.es';
// import TargetBlankExtension from './image/TargetBlankExtension.js';
// import '../../lib/style.css';

import '~/styles/style.less';
// import { Extension } from '@codemirror/state';
import { lineNumbers } from '@codemirror/view';
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
  // markdownItConfig: (mdit) => {
  // mdit.use(ancher, {
  //   permalink: true
  // });
  // mdit.use(TargetBlankExtension);
  // },
  markdownItPlugins(plugins, { editorId }) {
    return plugins.map((item) => {
      switch (item.type) {
        case 'taskList': {
          return {
            ...item,
            options: {
              ...item.options,
              enabled: editorId === 'md-prev'
            }
          };
        }

        case 'code': {
          return {
            ...item,
            options: {
              ...item.options,
              extraTools: '<span class="extra-code-tools">额外的功能</span>'
            }
          };
        }

        case 'katex': {
          return {
            ...item,
            options: {
              ...item.options
              // inlineDelimiters: [{ open: '$', close: '$' }]
              // blockDelimiters: [
              //   { open: '$$', close: '$$' },
              //   { open: '$', close: '$' }
              // ]
            }
          };
        }

        default: {
          return item;
        }
      }
    });
  },
  mermaidConfig: (base) => {
    return base;
  },
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
    mermaid: {
      //   instance: mermaid
      enableZoom: true
    }
  },
  editorExtensionsAttrs,
  editorConfig: {
    // zIndex: 2000
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

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(<App />);
