import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { config } from 'md-editor-rt';
import store from './store';
import App from './App';

import MarkExtension from 'markdown-it-mark';

import LinkAttr from 'markdown-it-link-attributes';

import { lineNumbers } from '@codemirror/view';
// import { basicSetup } from 'codemirror';

import 'md-editor-rt/lib/style.css';
import './styles/common.less';

import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import '@vavt/cm-extension/dist/previewTheme/arknights.css';

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
    md.use(LinkAttr, {
      attrs: {
        target: '_blank'
      }
    });
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
