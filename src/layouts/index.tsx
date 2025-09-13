'use client';
import { lineNumbers } from '@codemirror/view';
import ZH_TW from '@vavt/cm-extension/dist/locale/zh-TW';
import Anchor from 'markdown-it-anchor';
import LinkAttr from 'markdown-it-link-attributes';
import MarkExtension from 'markdown-it-mark';
import { config } from 'md-editor-rt';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import BackTop from '@/components/BackTop';
import store from '@/store';
import Header from './Header';

interface AppLayout {
  children: ReactNode;
}

config({
  markdownItPlugins(plugins, { editorId }) {
    return [
      ...plugins.map((item) => {
        if (item.type === 'taskList') {
          return {
            ...item,
            options: {
              ...item.options,
              enabled: editorId === 'editor-preview'
            }
          };
        }

        return item;
      }),
      {
        type: 'mark',
        plugin: MarkExtension,
        options: {}
      },
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            return !href.startsWith('#');
          },
          attrs: {
            target: '_blank'
          }
        }
      },
      {
        type: 'anchor',
        plugin: Anchor,
        options: {
          // permalink: true,
          permalink: Anchor.permalink.headerLink(),
          // permalinkSymbol: '#',
          // permalinkBefore: false,
          // permalinkSpace: false,
          slugify(s: string) {
            return s;
          }
        }
      }
    ];
  },
  codeMirrorExtensions(extensions) {
    const _exs = [
      ...extensions,
      {
        type: 'lineNumbers',
        extension: lineNumbers()
      }
    ];

    // _exs[1] = basicSetup;
    return _exs;
  },
  editorConfig: {
    languageUserDefined: {
      ZH_TW
    }
  }
});

const AppLayout = ({ children }: AppLayout) => {
  return (
    <Provider store={store}>
      <Header />
      {children}
      <BackTop />
    </Provider>
  );
};

export default AppLayout;
