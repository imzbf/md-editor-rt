import { createSlice, configureStore } from '@reduxjs/toolkit';
import { PreviewThemes } from 'md-editor-rt';
import { STORAGED_STORE_KEY } from '@/config';

export const isClient = typeof window !== 'undefined';

export type Theme = 'light' | 'dark';
export type Lang = 'zh-CN' | 'en-US';

export interface StateType {
  theme: Theme;
  previewTheme: PreviewThemes;
  codeTheme: string;
}

const initialState: StateType = {
  theme: 'light',
  previewTheme: 'default',
  codeTheme: 'atom'
};

const settingsSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    changeTheme(state, action) {
      state.theme = action.payload;
    },
    changePreviewTheme(state, action) {
      state.previewTheme = action.payload;
    },
    changeCodeTheme(state, action) {
      state.codeTheme = action.payload;
    },
    setAll(state, action) {
      Object.assign(state, action.payload);
    }
  }
});

export const { changeTheme, changePreviewTheme, changeCodeTheme, setAll } = settingsSlice.actions;

const store = configureStore({
  reducer: {
    setting: settingsSlice.reducer
  }
});

if (isClient) {
  const themeMedia = window.matchMedia('(prefers-color-scheme: light)');

  store.subscribe(() => {
    localStorage.setItem(STORAGED_STORE_KEY, JSON.stringify(store.getState().setting));
  });

  // 单独定义回调，方便添加/移除
  const onThemeChange = (e: MediaQueryListEvent) => {
    store.dispatch(changeTheme(e.matches ? 'light' : 'dark'));
  };

  // 初始监听
  themeMedia.addEventListener('change', onThemeChange);

  // 打印前移除监听，避免 window.print() 触发无效变化
  window.addEventListener('beforeprint', () => {
    themeMedia.removeEventListener('change', onThemeChange);
  });

  // 打印后恢复监听
  window.addEventListener('afterprint', () => {
    themeMedia.addEventListener('change', onThemeChange);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
