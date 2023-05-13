import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { config } from 'md-editor-rt';
import store from './store';
import App from './App';

import MarkExtension from 'markdown-it-mark';

import { lineNumbers } from '@codemirror/view';
// import { basicSetup } from 'codemirror';

import 'md-editor-rt/lib/style.css';
import './styles/common.less';

import ZH_TW from '@vavt/md-editor-extension/dist/locale/zh-TW';
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css';

config({
  markdownItConfig(md) {
    md.use(MarkExtension);
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
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
