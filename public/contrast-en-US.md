This is the content that is incompatible only.

## 🧙🏼 Upgrade from 5.x to 6.x

### 🐈 UMD

To keep pace with the evolution of the frontend ecosystem, some third-party dependencies have fully transitioned to ESM format starting from version 6.x. we will no longer provide UMD format support.

Here is the updated reference for global usage: [🤓 CDN](https://imzbf.github.io/md-editor-rt/en-US/demo#🤓%20CDN)

### 🔖 Props

#### 🧷 insertLinkDirect

Removed, now the input box no longer pops up when clicking on the add link

#### 🎱 mdHeadingId

Type changed

Now

```ts
type MdHeadingId = (options: {
  text: string;
  level: number;
  index: number;
  currentToken?: Token;
  nextToken?: Token;
}) => string;
```

Past

```ts
type MdHeadingId = (text: string, level: number, index: number) => string;
```

### 💴 Config

New:

```ts
import { config, type CodeMirrorExtension, type Themes } from 'md-editor-rt';
import { type KeyBinding } from '@codemirror/view';

config({
  codeMirrorExtensions(
    extensions: Array<CodeMirrorExtension>,
    options: {
      editorId: string;
      theme: Themes;
      keyBindings: Array<KeyBinding>;
    }
  ): Array<CodeMirrorExtension> {
    return extensions;
  }
});
```

```ts ::close
interface CodeMirrorExtension {
  /**
   * Only used to provide developers with a basis for distinguishing between different extensions.
   */
  type: string;
  /**
   * Extensions of CodeMirror
   */
  extension: Extension | ((options: any) => Extension);
  /**
   * A Compartment wrapping the extension, which only exists for certain extensions,
   * provides the capability to update the extension.
   */
  compartment?: Compartment;
  options?: any;
}
```

!!! note

Now you can accurately know which extension this is from extensions[i].type.

!!!

Past:

```ts
import { config, type CodeMirrorExtension, type Themes } from 'md-editor-rt';
import { type KeyBinding } from '@codemirror/view';

config({
  codeMirrorExtensions(
    theme: Themes,
    extensions: Array<Extension>,
    keyBindings: Array<KeyBinding>,
    options: {
      editorId: string;
    }
  ): Array<Extension> {
    return extensions;
  }
});
```

## 🧙🏼 Upgrade from 4.x to 5.x

!!! warning

Version 18.0.0 or higher of `react` must be used now!!!

!!!

### 🔖 Props

| name | description |
| --- | --- |
| editorId | Marked as deprecated, but still usable; it is recommended to use id instead. Note: Only the `MdEditor` and `MdPreview` components have been adjusted; other components still use `editorId` to identify that this is the editor's ID, not their own. |
| inputBoxWitdh | Spelling error, corrected to: inputBoxWidth. |
| noIconfont | Removed, and now use the open-source icon library [lucide](https://lucide.dev/icons/) as a replacement. |
| customIcon | Still supports custom icons, but some icon keywords have been updated. Please check [CustomIcon](https://imzbf.github.io/md-editor-rt/en-US/api#%F0%9F%98%AC%20customIcon). |

### Events

| name                  | description                                         |
| --------------------- | --------------------------------------------------- |
| onInputBoxWitdhChange | Spelling error, corrected to: onInputBoxWidthChange |

### 🪤 Internal Components

1. Remove the default XSS extension. Now export the extension XSSPlugin. Please add it yourself. [Example](https://imzbf.github.io/md-editor-rt/en-US/demo#%F0%9F%94%92%20Add%20XSS%20extension).
2. Remove the configuration related to iconfont. Specifically, this includes: `iconfontType`、`editorExtensions.iconfont`、`editorExtensions.iconfontClass`、`editorExtensionsAttrs.iconfont`、`editorExtensionsAttrs.iconfontClass`.

---

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
  const [text] = useState('hello md-editor-rt!');
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
  - **markedHeadingId**: deleted, use `mdHeadingId` instead of it

---

## Upgrade from 1.x to 2.x

This is the content that 2.x is incompatible with version 1.x only.

### Props

| name                | description                              |
| ------------------- | ---------------------------------------- |
| editorClass         | rename to `className`                    |
| hljs                | removed, use `MdEditor.config` to config |
| highlightJs         | the same                                 |
| highlightCss        | the same                                 |
| languageUserDefined | the same                                 |
| prettier            | rename to `noPrettier`, default `false`  |
| prettierCDN         | removed, use `MdEditor.config` to config |
| prettierMDCDN       | the same                                 |
| cropperCss          | the same                                 |
| cropperJs           | the same                                 |
| iconfontJs          | the same                                 |
| screenfull          | the same                                 |
| screenfullJs        | the same                                 |
| mermaid             | the same                                 |
| mermaidJs           | the same                                 |
| katex               | the same                                 |
| katexJs             | the same                                 |
| katexCss            | the same                                 |
| extensions          | the same                                 |

### Component

- Catalog

  `Editor.Catalog` is renamed to `Editor.MdCatalog`.

  For more usage, refer to branch [docs](https://github.com/imzbf/md-editor-rt/tree/docs).
