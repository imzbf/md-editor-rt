# Next.js integration

This example uses Next.js 16 Pages Router and React 19 with `md-editor-rt` 7.x. It renders the initial Markdown on the server, keeps the editor controlled with `value` / `onChange`, and updates a separate `MdPreview` with an external catalog.

From the repository root, with Node.js 22.12 or later:

```sh
cd examples/next
npm install
npm run dev
```

Open the address printed by Next.js. To check and build the application:

```sh
npm run lint
npm run build
npm start
```

- Global editor CSS is imported in [`src/pages/_app.jsx`](src/pages/_app.jsx); it also covers the preview on this page.
- The editor and preview use different ids. `MdCatalog.editorId` points to the preview's id.
- `scrollElement="html"` avoids reading `document` during server rendering.
- Pages Router does not require `'use client'`. In an App Router project, put stateful editor components behind that client boundary and import global CSS in the root layout.
- This example keeps the editor's default CDN loading. For offline resources, follow the [Web Component dependency setup](../web-component/src/MdEditorElement/MdEditorElement.tsx).
