## 🧙🏼 从 3.x 升级到 4.x

### 🏄🏼 引用方式

4.0 版本开始支持按需引用组件，不再默认导出编辑器。

#### 🏄🏼‍♂️ 全局引用

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

| 名称        | 说明                            |
| ----------- | ------------------------------- |
| previewOnly | 已移除，使用组件`MdPreview`替换 |

### 🪤 内部组件

新增`MdPreview`组件，替换原编辑器的`previewOnly`属性，可以减少代码体积。

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

## 🧙🏻‍♂️ 从 2.x 升级到 3.x

下面列举的是`3.x`不兼容`2.x`的内容，兼容内容不作展示。

### 🤹🏼‍♂️ 语法

- 删除线

  ```diff
  - ~It is a dream deeply rooted in the American dream.~
  + ~~It is a dream deeply rooted in the American dream.~~
  ```

### 🔩 Props

| 名称            | 说明                |
| --------------- | ------------------- |
| markedHeadingId | 修改为`mdHeadingId` |
| historyLength   | 已移除              |

### 🤿 配置项

```diff
MdEditor.config({
-  markedRenderer: (renderer) => renderer,
-  markedExtensions: [],
-  markedOptions,
+  codeMirrorExtensions: (theme, extensions) => extensions,
+  markdownItConfig: (mdit) { }
})
```

### 🎤 快捷键

| 键位     | 功能     | 说明   |
| -------- | -------- | ------ |
| CTRL + Q | 添加引用 | 已移除 |

### 🪤 内部组件

#### 🐻 目录导航

- **props**

  - `markedHeadingId`: 已删除，使用`mdHeadingId`代替。
