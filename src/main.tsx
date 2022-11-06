import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import MdEditor from 'md-editor-rt';
import store from './store';
import App from './App';

import MarkExtension from './utils/marked-mark';

import ZH_TW from '@vavt/md-editor-extension/dist/locale/zh-TW';
import '@vavt/md-editor-extension/dist/previewTheme/arknights.css';

MdEditor.config({
  markedExtensions: [MarkExtension],
  markedRenderer(renderer) {
    renderer.heading = (text, level) => {
      return `<h${level} id="${text}">${text}</h${level}>`;
    };

    renderer.link = (href, title = '', text = '') => {
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };

    return renderer;
  },
  editorConfig: {
    languageUserDefined: {
      ZH_TW
    }
  },
  editorExtensions: {
    highlight: {
      css: {
        atom: {
          light:
            'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css',
          dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css'
        }
      }
    }
  }
});

import 'md-editor-rt/lib/style.css';
import './styles/common.less';

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
