## 🧙🏼 Upgrade from 3.x to 4.x

### 🏄🏼 Usage

Starting from version 4.0, supports on-demand importing components and no longer exporting default editor.

#### 🏄🏼‍♂️ CDN

```diff
- <script src="https://unpkg.com/md-editor-rt@latest/lib/md-editor-rt.umd.js"></script>
+ <script src="https://unpkg.com/md-editor-rt@latest/lib/umd/index.js"></script>
<script>
  ReactDOM.createRoot(document.getElementById('root')).render(
-   React.createElement(MdEditorRT, {
+    React.createElement(MdEditorRT.MdEditor, {
      modelValue: 'Hello Editor!!'
    })
  );
</script>
```

#### 🏄🏼‍♀️ ES Module

```diff
- import MdEditor from 'md-editor-rt';
- const NormalToolbar = MdEditor.NormalToolbar;
- const DropdownToolbar = MdEditor.DropdownToolbar;
- const ModalToolbar = MdEditor.ModalToolbar;
- const MdCatalog = MdEditor.MdCatalog;
+ import { MdEditor, NormalToolbar, DropdownToolbar, ModalToolbar, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
```

### 🔖 Props

| name        | description                       |
| ----------- | --------------------------------- |
| previewOnly | deleted, replace with `MdPreview` |

### 🪤 Internal Components

New component `MdPreview` and replacing the attribute `previewOnly`.

```diff
import React, { useState } from 'react';
- import MdEditor from 'md-editor-rt';
+ import { MdPreview } from 'md-editor-rt';
- import 'md-editor-rt/lib/style.css';
+ import 'md-editor-rt/lib/preview.css';

export default () => {
  const [text] = useState('hello md-editor-rt！');
- return <MdEditor modelValue={text} previewOnly />;
+ return <MdPreview modelValue={text} />;
};
```

---

## 🧙🏻‍♂️ Upgrade from 2.x to 3.x

This is the content that 3.x is incompatible with version 2.x only.

### 🤹🏼‍♂️ Grammar

- Strikethrough

  ```diff
  - ~It is a dream deeply rooted in the American dream.~
  + ~~It is a dream deeply rooted in the American dream.~~
  ```

### 🔩 Props

| name            | description             |
| --------------- | ----------------------- |
| markedHeadingId | rename to `mdHeadingId` |
| historyLength   | deleted                 |

### 🤿 Config

```diff
MdEditor.config({
-  markedRenderer: (renderer) => renderer,
-  markedExtensions: [],
-  markedOptions,
+  codeMirrorExtensions: (theme, extensions) => extensions,
+  markdownItConfig: (mdit) { }
})
```

### 🎤 Shortcut Key

| key      | function | description |
| -------- | -------- | ----------- |
| CTRL + Q | quote    | deleted     |

### 🪤 Component

#### 🐻 MdCatalog

- **props**

  - `markedHeadingId`: deleted, use `mdHeadingId` instead of it
