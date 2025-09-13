下面仅列举不兼容的内容，兼容内容不作展示。

## 🧙🏼 从 5.x 升级到 6.x

### 🐈 UMD

为了跟进前端生态的发展，部分三方依赖自 6.x 开始已全面转向 ESM 模式，我们也不再继续提供 UMD 格式支持。

这里提供了全局使用的新的参考： [🤓 CDN 链接](https://imzbf.github.io/md-editor-rt/zh-CN/demo#%F0%9F%A4%93%20CDN%20%E9%93%BE%E6%8E%A5)

### 🔖 Props

#### 🧷 insertLinkDirect

移除，现在点击添加链接时不再弹出输入框

#### 🎱 mdHeadingId

类型变更

现在

```ts
type MdHeadingId = (options: {
  text: string;
  level: number;
  index: number;
  currentToken?: Token;
  nextToken?: Token;
}) => string;
```

以前

```ts
type MdHeadingId = (text: string, level: number, index: number) => string;
```

### 💴 Config

新：

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
   * 仅用来提供开发者分别不同扩展的依据
   */
  type: string;
  /**
   * CodeMirror的扩展
   */
  extension: Extension | ((options: any) => Extension);
  /**
   * 包裹扩展的Compartment，只有部分扩展有，提供扩展更新的能力
   */
  compartment?: Compartment;
  options?: any;
}
```

!!! note

现在你可以从 extensions[i].type 中准确的知道这个哪个扩展。

!!!

旧：

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

## 🧙🏼 从 4.x 升级到 5.x

!!! warning

现在必须使用 react >=18.0.0 的版本！！！

!!!

### 🔖 Props

| 名称 | 说明 |
| --- | --- |
| editorId | 标记为过时，仍然可以使用，建议使用 id 替换。注意：仅`MdEditor`和`MdPreview`组件调整，其他的组件仍然使用`editorId`，标识这是编辑器的 id 而非本身的。 |
| inputBoxWitdh | 拼写错误，修改为：inputBoxWidth 。 |
| noIconfont | 移除，现使用 [lucide](https://lucide.dev/icons/) 开源图标库替换。 |
| customIcon | 仍然支持自定义图标，但是更新了部分图标关键词，注意查阅 [CustomIcon](https://imzbf.github.io/md-editor-rt/zh-CN/api#%F0%9F%98%AC%20customIcon) 。 |

### 事件

| 名称                  | 说明                                    |
| --------------------- | --------------------------------------- |
| onInputBoxWitdhChange | 拼写错误，修改为：onInputBoxWidthChange |

### 🪤 内部扩展

1. 移除默认的 XSS 扩展，现在导出扩展`XSSPlugin`，请自行添加，[使用示例](https://imzbf.github.io/md-editor-rt/zh-CN/demo#%F0%9F%94%92%20%E6%B7%BB%E5%8A%A0%20xss%20%E6%89%A9%E5%B1%95)。
2. 移除 iconfont 相关的配置，详细的有：`iconfontType`、`editorExtensions.iconfont`、`editorExtensions.iconfontClass`、`editorExtensionsAttrs.iconfont`、`editorExtensionsAttrs.iconfontClass`。

---

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
  - **markedHeadingId**: 已删除，使用`mdHeadingId`代替。

---

## 从 1.x 升级到 2.x

下面列举的是`2.x`不兼容`1.x`的内容，兼容内容不作展示。

### Props

| 名称                | 说明                              |
| ------------------- | --------------------------------- |
| editorClass         | 修改为`className`                 |
| hljs                | 已移除，使用`MdEditor.config`配置 |
| highlightJs         | 同上                              |
| highlightCss        | 同上                              |
| languageUserDefined | 同上                              |
| prettier            | 修改为`noPrettier`，默认`false`   |
| prettierCDN         | 已移除，使用`MdEditor.config`配置 |
| prettierMDCDN       | 同上                              |
| cropperCss          | 同上                              |
| cropperJs           | 同上                              |
| iconfontJs          | 同上                              |
| screenfull          | 同上                              |
| screenfullJs        | 同上                              |
| mermaid             | 同上                              |
| mermaidJs           | 同上                              |
| katex               | 同上                              |
| katexJs             | 同上                              |
| katexCss            | 同上                              |
| extensions          | 同上                              |
