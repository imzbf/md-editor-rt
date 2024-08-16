/// <reference types="vite/client" />

declare namespace JSX {
  interface IntrinsicElements {
    'md-editor-element': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }
}

declare module '*.md';
