import { PreviewThemes } from 'md-editor-rt';
import { createStore } from 'redux';
import { STORAGED_STORE_KEY } from '@/config';

export type Theme = 'light' | 'dark';
export type Lang = 'zh-CN' | 'en-US';

export interface StateType {
  // 主题
  theme: Theme;
  // 预览主题
  previewTheme: PreviewThemes;
  // 代码主题
  codeTheme: string;
  // 语言
  lang: Lang;
}

const stagedStore = localStorage.getItem(STORAGED_STORE_KEY);

const defaultState: StateType = stagedStore
  ? JSON.parse(stagedStore)
  : {
      theme: 'light',
      previewTheme: 'default',
      codeTheme: 'atom',
      lang: 'en-US'
    };

if (!defaultState.lang) {
  defaultState.lang = 'en-US';
}

const setting = (state = defaultState, action: any) => {
  const newState = JSON.parse(JSON.stringify(state));

  switch (action.type) {
    case 'changeTheme': {
      newState.theme = action.value;
      break;
    }
    case 'changePreviewTheme': {
      newState.previewTheme = action.value;
      break;
    }
    case 'changeCodeTheme': {
      newState.codeTheme = action.value;
      break;
    }
    case 'changeLang': {
      newState.lang = newState.lang === 'zh-CN' ? 'en-US' : 'zh-CN';
    }
  }

  localStorage.setItem(STORAGED_STORE_KEY, JSON.stringify(newState));
  return newState;
};

export default createStore(setting);
