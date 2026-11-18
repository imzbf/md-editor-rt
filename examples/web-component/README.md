# React Web Component integration

A browser-native `<md-editor-element>` hosts a React editor in an open shadow root. It uses local instances of all optional editor dependencies, including ECharts, and imports their CSS locally.

From the repository root, with Node.js 22.12 or later:

```sh
cd examples/web-component
npm install
npm run dev
```

To check the source and preview a production build:

```sh
npm run lint
npm run build
npm run preview
```

[`src/MdEditorElement/index.tsx`](src/MdEditorElement/index.tsx) owns the React root and releases it when the custom element disconnects. Registration is guarded so a repeated `register()` call does not throw. The sample's text lives in the React component's controlled state.

Vite's `?inline` CSS import supplies styles in both development and production. The stylesheet lives outside React's mount point inside the shadow root. KaTeX font faces are also registered at document level; no iconfont or build-only CSS injection plugin is needed.

Copy the element module and its dependencies into the host application and call `register()` from a browser entry point. If adding a catalog whose scrolling container is inside the shadow root, use `isScrollElementInShadow`. The local dependency configuration is global to the loaded editor package, so initialize it once before mounting instances.
