import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { config } from 'md-editor-rt';
import store from './store';
import App from './App';

import MarkExtension from 'markdown-it-mark';
import Anchor from 'markdown-it-anchor';
import LinkAttr from 'markdown-it-link-attributes';

import { lineNumbers } from '@codemirror/view';
// import { basicSetup } from 'codemirror';

import 'md-editor-rt/lib/style.css';
import './styles/common.less';

import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import '@vavt/cm-extension/dist/previewTheme/arknights.css';

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'mark',
        plugin: MarkExtension,
        options: {}
      },
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          attrs: {
            target: '_blank'
          }
        }
      },
      {
        type: 'anchor',
        plugin: Anchor,
        options: {
          permalink: true,
          permalinkSymbol: '#',
          permalinkBefore: false,
          permalinkSpace: false,
          slugify(s: string) {
            return s;
          }
        }
      }
    ];
  },
  codeMirrorExtensions(theme, extensions) {
    const _exs = [...extensions, lineNumbers()];

    // _exs[1] = basicSetup;
    return _exs;
  },
  editorConfig: {
    languageUserDefined: {
      ZH_TW
    }
  }
});

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
