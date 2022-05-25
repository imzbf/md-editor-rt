interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  // 更多环境变量...
  [x: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.md' {
  const Component: ComponentOptions;
  export default Component;
}
