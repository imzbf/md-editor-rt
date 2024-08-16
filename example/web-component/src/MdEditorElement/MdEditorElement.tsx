import { useState } from 'react';
import { MdEditor, config } from 'md-editor-rt';
import screenfull from 'screenfull';
import katex from 'katex';
import Cropper from 'cropperjs';
import mermaid from 'mermaid';
import highlight from 'highlight.js';

// >=3.0
import * as prettier from 'prettier';
import parserMarkdown from 'prettier/plugins/markdown';

import './index.css';

import md from './data.md';

config({
  iconfontType: 'class',
  editorExtensions: {
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    highlight: {
      instance: highlight
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

const MdEditorElement = () => {
  const [text, setText] = useState(md);
  return <MdEditor modelValue={text} onChange={setText} />;
};

export default MdEditorElement;
