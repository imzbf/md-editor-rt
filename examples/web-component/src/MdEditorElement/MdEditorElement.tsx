import Cropper from 'cropperjs';
import * as echarts from 'echarts';
import highlight from 'highlight.js';
import katex from 'katex';
import { MdEditor, config } from 'md-editor-rt';
import mermaid from 'mermaid';
import parserMarkdown from 'prettier/plugins/markdown';
import * as prettier from 'prettier/standalone';
import { useState } from 'react';
import screenfull from 'screenfull';
import markdown from './data.md?raw';

// Configure shared dependencies once, before any custom element mounts.
config({
  editorExtensions: {
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    highlight: { instance: highlight },
    screenfull: { instance: screenfull },
    katex: { instance: katex },
    cropper: { instance: Cropper },
    mermaid: { instance: mermaid },
    echarts: { instance: echarts }
  }
});

export default function MdEditorElement() {
  const [text, setText] = useState(markdown);
  return <MdEditor value={text} onChange={setText} />;
}
