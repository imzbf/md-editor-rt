import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import MdEditor from 'md-editor-rt';
import store from './store';
import App from './App';

import MarkExtension from './utils/marked-mark';

MdEditor.config({
  markedExtensions: [MarkExtension],
  markedRenderer(renderer) {
    renderer.heading = (text, level) => {
      return `<h${level} id="${text}">${text}</h${level}>`;
    };

    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title}" target="_blank">${text}</a>`;
    };

    return renderer;
  },
  editorExtensions: {
    highlight: {
      css: {
        atom: {
          light:
            'https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/atom-one-dark.css',
          dark: 'https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/atom-one-dark.css'
        }
      }
    }
  }
});

import 'md-editor-rt/lib/style.css';
import './style.less';

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
);
