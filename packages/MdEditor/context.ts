import { createContext } from 'react';
import { ContentType } from './type';
import { staticTextDefault } from './config';

export const EditorContext = createContext<ContentType>({
  editorId: '',
  tabWidth: 2,
  theme: 'light',
  language: 'zh-CN',
  highlight: {
    css: '',
    js: ''
  },
  showCodeRowNumber: false,
  usedLanguageText: staticTextDefault['zh-CN'],
  previewTheme: 'default',
  customIcon: {},
  rootRef: null,
  disabled: undefined
});
