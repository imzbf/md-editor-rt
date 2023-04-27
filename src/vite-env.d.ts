/// <reference types="vite/client" />

declare module '*.md' {
  const Component: ComponentOptions;
  export default Component;
}

declare module 'markdown-it-mark';
