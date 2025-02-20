> 在线尝试示例：[传送门](https://codesandbox.io/s/elated-khorana-65jmr)。

## 🔖 MdPreview Props

这是预览组件`MdPreview`的`Props`，它们同样也是`MdEditor`的：

### 📃 value

- **类型**：`string`
- **默认值**：`''`

  编辑的内容。

  ```jsx
  <MdEditor value="xxx" />
  ```

---

### 📃 modelValue

- **类型**：`string`
- **默认值**：`''`

  已过时。5.x 版本开始使用 value 替换。

---

### 🛍 theme

- **类型**：`'light' | 'dark'`
- **默认值**：`'light'`

  编辑器主题。

  ```jsx
  <MdEditor theme="dark" />
  ```

---

### 🎀 className

- **类型**：`string`
- **默认值**：`''`

  ...

---

### 🔤 language

- **类型**：`string`
- **默认值**：`'zh-CN'`

  内置中英文(`'zh-CN'`, `'en-US'`)，可自行扩展其他语言，同时可覆盖内置的中英文。

  你也可以使用现成的扩展语言：[md-editor-extension](https://github.com/imzbf/md-editor-extension)。使用及贡献方式见扩展库文档~

---

### 🎲 editorId

- **类型**：`string`
- **默认值**：`'md-editor-r\d'`

  已过时。5.x 版本开始使用 id 替换。

  编辑器唯一标识，使用默认前缀和`useId`拼接。~~当使用服务端渲染时，请务必设置该属性为固定值，防止产生服务端与客户端渲染内容不一致错误提示。~~，5.0 开始没有该限制。

---

### 🎲 id

- **类型**：`string`
- **默认值**：`'md-editor-r\d'`

  编辑器唯一标识，使用默认前缀和`useId`拼接。

---

### 🔢 showCodeRowNumber

- **类型**：`boolean`
- **默认值**：`true`

  代码块是否显示行号。

---

### 🔦 previewTheme

- **类型**：`'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'`
- **默认值**：`'default'`

  预览内容主题，支持自定义。

  主题自定义方式：

  1. 编辑 css

  ```css
  .xxx-theme {
    color: red;
  }
  ```

  2. 设置`previewTheme`

  ```jsx
  <MdEditor previewTheme="xxx" />
  ```

  参考[markdown-theme](https://github.com/imzbf/markdown-theme)项目。

---

### 🎅🏻 style

- **类型**：`CSSProperties`
- **默认值**：`{}`

  编辑器内联样式。

---

### ☝️ noMermaid

- **类型**：`boolean`
- **默认值**：`false`

  如果你不希望使用图表展示内容，可以设置关闭。

```jsx
<MdEditor noMermaid />
```

---

### ❌ noKatex

- **类型**：`boolean`
- **默认值**：`false`

  如果你不希望使用数学公式展示内容，可以设置关闭。

```jsx
<MdEditor noKatex />
```

---

### 🦉 codeTheme

- **类型**：`'atom'|'a11y'|'github'|'gradient'|'kimbie'|'paraiso'|'qtcreator'|'stackoverflow'`
- **默认值**：`'atom'`

  代码块高亮样式名称。

  你可以添加自己的样式，把该属性设置为你想要的即可，方式如下：

  1. 配置样式链接

  ```js
  import { config } from 'md-editor-rt';

  config({
    editorExtensions: {
      highlight: {
        css: {
          atom: {
            light:
              'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-light.min.css',
            dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css',
          },
          xxx: {
            light:
              'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-light.css',
            dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-dark.css',
          },
        },
      },
    },
  });
  ```

  2. 设置`codeTheme`

  ```jsx
  <MdEditor codeTheme="xxx" />
  ```

---

### 🎱 mdHeadingId

- **类型**：`(text: string, level: number, index: number) => string`
- **默认值**：`(text) => text`

  构造标题`ID`的生成方式。

  ```jsx
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const mdHeadingId = (_text, _level, index) => `heading-${index}`;

  export default () => {
    return <MdEditor mdHeadingId={mdHeadingId} />;
  };
  ```

---

### 🐣 sanitize

- **类型**：`(html: string) => string`
- **默认值**：`(html) => html`

  通过该属性修改编译后的 html 内容

  !!! warning

  该属性为保留属性

  基本的危险代码处理方案在 3.x 以后已内置，例如`<script>alert(123)</script>`，4.11.3 之前建议使用该属性来清理更复杂的内容以防止 XSS。

  在 4.11.3 以后实现了更完善的处理方案，[参考](https://imzbf.github.io/md-editor-rt/zh-CN/demo#%F0%9F%94%8F%20%E4%BF%AE%E6%94%B9%20xss%20%E9%85%8D%E7%BD%AE)

  !!!

  使用`sanitize-html`演示

  ```jsx
  import sanitizeHtml from 'sanitize-html';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const sanitize = (html) => sanitizeHtml(html);

  export default () => {
    return <MdEditor sanitize={sanitize} />;
  };
  ```

---

### 💅 formatCopiedText

- **类型**：`(text: string) => string`
- **默认值**：`(text) => text`

  格式化复制代码

  ```jsx
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const formatCopiedText = (text: string) => {
    return `${text}  - from md-editor-rt`;
  };

  export default () => {
    return <MdEditor formatCopiedText={formatCopiedText} />;
  };
  ```

---

### 🛁 codeStyleReverse

- **类型**：`boolean`
- **默认值**：`true`

  某些预览主题的代码模块背景是暗色系，将这个属性设置为 true，会自动在该主题下的 light 模式下使用暗色系的代码风格。

---

### 🧼 codeStyleReverseList

- **类型**：`Array`
- **默认值**：`['default', 'mk-cute']`

  需要自动调整的预览主题，已默认包含 default、mk-cute。

---

### 🕊 noHighlight

- **类型**：`boolean`
- **默认值**：`false`

  不高亮代码，也不会加载相应的扩展库

---

### 🕊 noImgZoomIn

- **类型**：`boolean`
- **默认值**：`false`

  是否关闭编辑器默认的放大功能。

  ```html
  <MdEditor noImgZoomIn />
  ```

  在`4.15.4`以后，也可以设置`.not-zoom`来禁用它

  ```markdown
  <img class="not-zoom">
  ```

---

### 😬 customIcon

- **类型**：`CustomIcon`
- **默认值**：`{}`

  自定义的图标

  !!! warning 类型提示

  copy、collapse-tips 对应的图标只能是字符串，其他的都可以是组件或者字符串

  !!!

  ```tsx
  import React from 'react';
  import type { CustomIcon } from 'md-editor-rt';
  import { MdEditor, StrIcon } from 'md-editor-rt';
  // 假设你使用了三方图标库或者自定义了图标组件
  import { IconFont } from 'tdesign-icons-react';
  import 'md-editor-rt/lib/style.css';

  const customIcon: CustomIcon = {
    bold: {
      component: 'A',
    },
    // 演示使用默认图标复制内容
    copy: StrIcon('copy', {}),
    // copy: '<i class="fa fa-car"></i>',
    // 'collapse-tips': '<i class="fa fa-car"></i>',
    preview: {
      component: '<i class="fa fa-car"></i>',
    },
    github: {
      component: IconFont,
      props: {
        name: 'sneer',
      },
    },
  };

  export default () => {
    return <MdEditor modelValue="" customIcon={customIcon} />;
  };
  ```

  类型`CustomIcon`

  ```ts
  type IconName =
    | 'bold'
    | 'underline'
    | 'italic'
    | 'strike-through'
    | 'title'
    | 'sub'
    | 'sup'
    | 'quote'
    | 'unordered-list'
    | 'ordered-list'
    | 'task'
    | 'code-row'
    | 'code'
    | 'link'
    | 'image'
    | 'table'
    | 'revoke'
    | 'next'
    | 'save'
    | 'prettier'
    | 'minimize'
    | 'maximize'
    | 'fullscreen-exit'
    | 'fullscreen'
    | 'preview-only'
    | 'preview'
    | 'preview-html'
    | 'catalog'
    | 'github'
    | 'mermaid'
    | 'formula'
    | 'close'
    | 'delete'
    | 'upload';

  type CustomIcon = {
    [key in IconName]?: {
      component: Component | JSX.Element | string;
      props: {
        [key: string | number | symbol]: any;
      };
    };
  } & {
    copy?: string;
    'collapse-tips'?: string;
  };
  ```

---

### 🕊 sanitizeMermaid

- **类型**：`(h: string) => Promise<string>`
- **默认值**：`(h: string) => Promise.resolve(h)`

  转换生成的 mermaid 代码

---

### 🕹 codeFoldable

- **类型**：`boolean`
- **默认值**：`true`

  是否开启折叠代码功能

---

### ⏲ autoFoldThreshold

- **类型**：`number`
- **默认值**：`30`

  触发自动折叠代码的行数阈值

---

## 🔩 MdEditor Props

除去和`MdPreivew`相同的以外：

### 💻 pageFullscreen

- **类型**：`boolean`
- **默认值**：`false`

  页面内全屏。

---

### 📱 preview

- **类型**：`boolean`
- **默认值**：`true`

  是否显示预览。

---

### 📀 htmlPreview

- **类型**：`boolean`
- **默认值**：`false`

  是否显示 html 预览。当设置为`true`时，需要将`preview`设置为`false`

  ```jsx
  <MdEditor htmlPreview preview={false} />
  ```

---

### 🧱 toolbars

- **类型**：`Array`
- **默认值**：`[all]`

  选择性展示工具栏，可选内容见下方。

  你可以随意排序工具栏，通过`'-'`分割两个工具，通过`'='`实现左右放置！

  _[all]_

  ```js
  [
    'bold',
    'underline',
    'italic',
    '-',
    'strikeThrough',
    'sub',
    'sup',
    'quote',
    'unorderedList',
    'orderedList',
    'task',
    '-',
    'codeRow',
    'code',
    'link',
    'image',
    'table',
    'mermaid',
    'katex',
    '-',
    'revoke',
    'next',
    'save',
    '=',
    'pageFullscreen',
    'fullscreen',
    'preview',
    'previewOnly',
    'htmlPreview',
    'catalog',
    'github',
  ];

  // 对应功能名称
  [
    '加粗',
    '下划线',
    '斜体',
    '删除线',
    '下标',
    '上标',
    '引用',
    '无序列表',
    '有序列表',
    '任务',
    '行内代码',
    '块级代码',
    '链接',
    '图片',
    '表格',
    '图表',
    '公式',
    '后退一步',
    '前进一步',
    '保存',
    '页面内全屏',
    '屏幕全屏',
    '内容预览',
    'html代码预览',
    '目录',
    '源码地址',
  ];
  ```

---

### 🧱 toolbarsExclude

- **类型**：`Array`
- **默认值**：`[]`

  选择性不展示工具栏，内容同上。

---

### 💪 defToolbars

- **类型**：`Array<ReactNode>`
- **默认值**：`[]`

  自定义工具栏插槽，通过使用内置的`NormalToolbar`普通点击触发事件组件，`DropdownToolbar`下拉点击触发事件组件，和`ModalToolbar`弹窗组件进行扩展。将`defToolbars`插槽中的组件下标穿插在`toolbars`实现展示（这并不规范）

  ```jsx
  import { MdEditor, NormalToolbar } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const handler = () => {
    console.log('NormalToolbar clicked!');
  };

  const toolbars = ['github', '=', 0];

  const defToolbars = [
    <NormalToolbar
      title="mark"
      onClick={handler}
      key="nt"
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
    />,
  ];

  export default () => (
    <MdEditor modelValue="" toolbars={toolbars} defToolbars={defToolbars} />
  );
  ```

  ![普通扩展工具栏](https://imzbf.github.io/md-editor-rt/imgs/normal-toolbar.gif)

  ![下拉扩展工具栏](https://imzbf.github.io/md-editor-rt/imgs/dropdown-toolbar.gif)

  扩展组件属性参考**内置组件**，使用示例参见[文档分支](https://github.com/imzbf/md-editor-rt/tree/docs/src/components)，提供**标记**、**表情**和**弹窗预览**扩展组件。

---

### 🪒 noPrettier

- **类型**：`boolean`
- **默认值**：`false`

  是否启用 prettier 优化 md 内容。

---

### 🤏 tabWidth

- **类型**：`number`
- **默认值**：`2`

  编辑器一个 TAB 键等于空格数。

---

### 📅 tableShape

- **类型**：`[number, number] \| [number, number, number, number]`
- **默认值**：`[6, 4]`

  标题栏添加表格时，预设待选表格大小，第一个代表最大列数，第二个代表最大行数，第三个代表扩展最大列数，第四个代表扩展最大行数。

  ```jsx
  const tableShape = [8, 4];

  () => <MdEditor tableShape={tableShape}>
  ```

  ![表格预设大小预览](https://imzbf.github.io/md-editor-rt/imgs/20211216165424.png)

---

### 🪧 placeholder

- **类型**：`string`
- **默认值**：`''`

  啊这-\_-！

---

### 🦶 footers

- **类型**：`Array<'markdownTotal' | '=' | 'scrollSwitch' | number>`
- **默认值**：`['markdownTotal', '=', 'scrollSwitch']`

  页脚显示内容，`'='`左右分割，设置为`[]`不显示页脚。

---

### 🦿 defFooters

- **类型**：`Array<ReactNode>`
- **默认值**：`[]`

  自定义扩展页脚。

  示例代码见[文档页源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx)。

---

### ⛵️ scrollAuto

- **类型**：`boolean`
- **默认值**：`true`

  默认左右同步滚动状态。

---

### 🥹 noUploadImg

- **type**: `boolean`
- **default**: `false`

  工具栏不显示上传图片入口。

  ```jsx
  <MdEditor noUploadImg />
  ```

---

### 🔬 autoFocus

- **类型**：`boolean`
- **默认值**：`false`

  原生属性，文本区域自动获得焦点。

---

### 🔩 disabled

- **类型**：`boolean`
- **默认值**：`false`

  原生属性，禁用文本区域。

---

### 🔒 readOnly

- **类型**：`boolean`
- **默认值**：`false`

  原生属性，文本区域为只读。

---

### 📏 maxLength

- **类型**：`number`
- **默认值**：``

  原生属性，文本区域允许的最大字符数。

---

### 📥 autoDetectCode

- **类型**：`boolean`
- **默认值**：`false`

  是否启用自动识别粘贴代码类别，目前仅支持从`vscode`复制的内容。

---

### 📝 completions

- **类型**：`Array<CompletionSource>`
- **默认值**：`[]`

  添加额外的输入自动完成来源。

  ```jsx
  import { useMemo, useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [t, s] = useState('');

    const completions = useMemo(() => {
      return [
        (context) => {
          const word = context.matchBefore(/@\w*/);

          if (word === null || (word.from == word.to && context.explicit)) {
            return null;
          }

          return {
            from: word.from,
            options: [
              {
                label: '@imzbf',
                type: 'text',
              },
            ],
          };
        },
      ];
    }, []);

    return <MdEditor modelValue={t} onChange={s} completions={completions} />;
  };
  ```

---

### 📥 showToolbarName

- **类型**：`boolean`
- **默认值**：`false`

  是否在工具栏下面显示对应的文字名称

![](https://imzbf.github.io/md-editor-rt/imgs/showToolbarName.jpg)

---

### 📥 inputBoxWidth

- **类型**：`string`
- **默认值**：`50%`

  输入框默认的宽度

![](https://imzbf.github.io/md-editor-rt/imgs/drag-width.jpg)

---

### 🪒 transformImgUrl

- **类型**：`(imgUrl: string) => string | Promise<string>`
- **默认值**：`t => t`

  转换图片链接

---

### 🔖 catalogLayout

- **类型**：`'fixed' | 'flat'`
- **默认值**：`fixed`

  \>=5.3.0 内置的目录显示的状态，'fixed': 悬浮在内容上方，'flat': 展示在右侧

---

## 🧵 MdPreview 绑定事件

### 📞 onChange

- **类型**：`(v: string) => void`

  内容变化事件（当前与`textare`的`oninput`事件绑定，每输入一个单字即会触发）。

---

### 🚁 onHtmlChanged

- **类型**：`(h: string) => void`

  html 变化回调事件，用于获取预览 html 代码。

---

### 🗒 onGetCatalog

- **类型**：`(list: HeadList[]) => void`

  动态获取`markdown`目录。

---

### 🔃 onRemount

- **类型**：`() => void`

  \>=5.3.0 内容重新挂载事件，在这个事件中能够正确获取到内容中的节点。

---

## 🪢 MdEditor 绑定事件

除去和`MdPreivew`相同的以外：

### 💾 onSave

- **类型**：`(v: string, h: Promise<string>) => void`

  保存事件，快捷键与保存按钮均会触发。

  ```jsx
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const onSave = (v, h) => {
    console.log(v);

    h.then((html) => {
      console.log(html);
    });
  };

  export default () => <MdEditor onSave={onSave} />;
  ```

---

### 📸 onUploadImg

- **类型**：`files: Array<File>, callback: (urls: string[] | { url: string; alt: string; title: string }[]) => void`

  上传图片事件，弹窗会等待上传结果，务必将上传后的 urls 作为 callback 入参回传。

  ```jsx
  import { useState } from 'react';
  import axios from 'axios';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const onUploadImg = async (files, callback) => {
    const res = await Promise.all(
      files.map((file) => {
        return new Promise((rev, rej) => {
          const form = new FormData();
          form.append('file', file);

          axios
            .post('/api/img/upload', form, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            })
            .then((res) => rev(res))
            .catch((error) => rej(error));
        });
      })
    );

    // 方式一
    callback(res.map((item) => item.data.url));
    // 方式二
    // callback(
    //   res.map((item: any) => ({
    //     url: item.data.url,
    //     alt: 'alt',
    //     title: 'title'
    //   }))
    // );
  };

  export default () => {
    const [text, setText] = useState('# Hello Editor');
    return (
      <MdEditor
        modelValue={text}
        onChange={setText}
        onUploadImg={onUploadImg}
      />
    );
  };
  ```

---

### 💀 onError

- **类型**：`(err: { name: 'Cropper' \| 'fullscreen' \| 'prettier' \| 'overlength'; message: string }) => void`

  捕获执行错误事件，目前支持`Cropper`、`fullscreen`、`prettier`实例未加载完成操作，以及输入内容超出限制长度的错误。

  ```jsx
  const onError = (err) => {
    alert(err.message);
  };

  export default () => <MdEditor onError={onError} />;
  ```

---

### 🐾 onBlur

- **类型**：`(event: FocusEvent) => void`

  输入框失去焦点时触发事件。

  ```jsx
  const onBlur = (err) => {
    console.log('onBlur', e);
  };

  export default () => <MdEditor onBlur={onBlur} />;
  ```

---

### 🔖 onFocus

- **类型**：`(event: FocusEvent) => void`

  输入框获得焦点时触发事件。

---

### 🔖 onInput

- **类型**：`(event: Event) => void`

  输入框键入内容事件。

---

### 🔖 onDrop

- **类型**：`(event: DragEvent) => void`

  拖放内容事件。

  ```jsx
  import { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const onDrop = (e) => {
    e.preventDefault();
    console.log(e.dataTransfer?.files[0]);
  };

  export default () => {
    const [text, setText] = useState('');
    return <MdEditor modelValue={text} onChange={setText} onDrop={onDrop} />;
  };
  ```

---

### 🔖 onInputBoxWidthChange

- **类型**：`(width: string) => void`

  调整输入框宽度事件

---

## 🤱🏼 实例暴露

2.5.0 版本之后，编辑器暴露了若干方法在组件实例上，用来快捷监听编辑器内部状态或对调整内部状态。

```jsx
import { useState, useEffect, useRef } from 'react';
import { MdEditor, ExposeParam } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('#Hello Editor');
  const editorRef = useRef<ExposeParam>();

  useEffect(() => {
    editorRef.current?.on('catalog', console.log);
  }, []);

  return <MdEditor ref={editorRef} modelValue={text} onChange={setText} />;
};
```

| Name                 | MdEditor | MdPreview |
| -------------------- | -------- | --------- |
| on                   | √        | ×         |
| togglePageFullscreen | √        | ×         |
| toggleFullscreen     | √        | ×         |
| togglePreview        | √        | ×         |
| togglePreviewOnly    | √        | ×         |
| toggleHtmlPreview    | √        | ×         |
| toggleCatalog        | √        | ×         |
| triggerSave          | √        | ×         |
| insert               | √        | ×         |
| focus                | √        | ×         |
| rerender             | √        | √         |
| getSelectedText      | √        | ×         |
| resetHistory         | √        | ×         |

### 👂🏼 on

监听编辑器内部状态，包括：屏幕全屏、浏览器全屏、预览文本、预览 html、目录等。

- pageFullscreen

  ```js
  editorRef.current?.on('pageFullscreen', (status) => console.log(status));
  ```

- fullscreen

  ```js
  editorRef.current?.on('fullscreen', (status) => console.log(status));
  ```

- preview

  ```js
  editorRef.current?.on('preview', (status) => console.log(status));
  ```

- previewOnly

  ```js
  editorRef.current?.on('previewOnly', (status) => console.log(status));
  ```

- htmlPreview

  ```js
  editorRef.current?.on('htmlPreview', (status) => console.log(status));
  ```

- catalog

  ```js
  editorRef.current?.on('catalog', (status) => console.log(status));
  ```

---

### 💻 togglePageFullscreen

切换页面内全屏。

```js
editorRef.current?.togglePageFullscreen(true);
```

> 不设置入参切换为相反状态

---

### 🖥 toggleFullscreen

切换屏幕全屏。

```js
editorRef.current?.toggleFullscreen(true);
```

> 不设置入参切换为相反状态

---

### 📖 togglePreview

切换是否显示预览。

```js
editorRef.current?.togglePreview(true);
```

> 不设置入参切换为相反状态

---

### 📖 togglePreviewOnly

切换仅预览状态。

```js
editorRef.current?.togglePreviewOnly(true);
```

> 不设置入参切换为相反状态

---

### 📼 toggleHtmlPreview

切换是否显示 html 预览。

```js
editorRef.current?.toggleHtmlPreview(true);
```

> 不设置入参切换为相反状态

---

### 🧬 toggleCatalog

切换是否显示目录。

```js
editorRef.current?.toggleCatalog(true);
```

> 不设置入参切换为相反状态

---

### 💾 triggerSave

触发保存。

```js
editorRef.current?.triggerSave();
```

---

### 💉 insert

手动向文本框插入内容。

```js
/**
 * @params selectedText 选中的内容
 */
editorRef.current?.insert((selectedText) => {
  /**
   * @return targetValue    待插入内容
   * @return select         插入后是否自动选中内容，默认：true
   * @return deviationStart 插入后选中内容鼠标开始位置，默认：0
   * @return deviationEnd   插入后选中内容鼠标结束位置，默认：0
   */
  return {
    targetValue: `${selectedText}`,
    select: true,
    deviationStart: 0,
    deviationEnd: 0,
  };
});
```

---

### 🎯 focus

手动聚焦输入框。

```ts
import type { FocusOption } from 'md-editor-rt';

const option: FocusOption | undefined = 'start';

// 聚焦时光标的位置，不提供默认上次失焦时的位置
editorRef.current?.focus(option);
```

```ts
type FocusOption =
  | 'start'
  | 'end'
  | {
      // 选中的开始位置，默认光标位置
      rangeAnchor?: number;
      // 选中的结束位置，默认光标位置
      rangeHead?: number;
      // 光标的位置
      cursorPos: number;
    };
```

---

### ✒️ rerender

手动重新渲染内容。

```js
editorRef.current?.rerender();
```

---

### 🔍 getSelectedText

获取当前选中的文字。

```js
console.log(editorRef.current?.getSelectedText());
```

---

### 🗑 resetHistory

清除当前的历史记录。

---

### 🎛 domEventHandlers

支持监听全部的 dom 事件。

```js
editorRef.current?.domEventHandlers({
  compositionstart: () => {
    console.log('compositionstart');
  },
});
```

---

### 🎛 execCommand

通过触发器向编辑器插入内容。

```js
editorRef.current?.execCommand('bold');
```

---

### 🔖 getEditorView

获取 codemirror 实例。

---

## 💴 配置编辑器

使用`config(option: ConfigOption)`方法，可以对构建实例进行定制。

!!! warning

我们建议你在项目入口配置，例如 vite 创建的项目中的 main.js。不要在组件中去调用 `config` ！

!!!

### 🦪 codeMirrorExtensions

根据主题和内部默认的 codeMirror 扩展自定义新的扩展。

```ts
type CodeMirrorExtensions = (
  theme: Themes,
  extensions: Array<Extension>,
  keyBindings: Array<KeyBinding>,
  options: {
    editorId: string;
  }
) => Array<Extension>;
```

使用示例：编辑器默认不显示输入框的行号，需要手动添加扩展

```js
import { config } from 'md-editor-rt';
import { lineNumbers } from '@codemirror/view';

config({
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers()];
  },
});
```

---

### 🍤 markdownItConfig

自定义 markdown-it 核心库扩展、属性等。

```ts
type MarkdownItConfig = (
  md: markdownit,
  options: {
    editorId: string;
  }
) => void;
```

使用示例：配置使用`markdown-it-anchor`并在标题右侧显示一个超链接符号

```js
import { config } from 'md-editor-rt';
import ancher from 'markdown-it-anchor';

config({
  markdownItConfig(mdit) {
    mdit.use(ancher, {
      permalink: true,
    });
  },
});
```

---

### 🍤 markdownItPlugins

挑选、新增 markdown-it 核心库已预设的扩展。

```ts
type MarkdownItPlugins = (
  plugins: Array<MarkdownItConfigPlugin>,
  options: {
    editorId: string;
  }
) => Array<MarkdownItConfigPlugin>;
```

使用示例：修改图片的类名

```js
import { config } from 'md-editor-rt';

config({
  markdownItPlugins(plugins) {
    return plugins.map((p) => {
      if (p.type === 'image') {
        return {
          ...p,
          options: {
            ...p.options,
            classes: 'my-class',
          },
        };
      }

      return p;
    });
  },
});
```

---

### 🍙 editorConfig

编辑器常规配置，语言、`mermaid`默认模板、渲染延迟：

#### 🍚 languageUserDefined

```js
import { config } from 'md-editor-rt';

config({
  editorConfig: {
    // 语言
    languageUserDefined: {
      'my-lang': {
        toolbarTips: {
          bold: '加粗',
          underline: '下划线',
          italic: '斜体',
          strikeThrough: '删除线',
          title: '标题',
          sub: '下标',
          sup: '上标',
          quote: '引用',
          unorderedList: '无序列表',
          orderedList: '有序列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'mermaid图',
          katex: '公式',
          revoke: '后退',
          next: '前进',
          save: '保存',
          prettier: '美化',
          pageFullscreen: '浏览器全屏',
          fullscreen: '屏幕全屏',
          preview: '预览',
          previewOnly: '仅预览',
          htmlPreview: 'html代码预览',
          catalog: '目录',
          github: '源码地址',
        },
        titleItem: {
          h1: '一级标题',
          h2: '二级标题',
          h3: '三级标题',
          h4: '四级标题',
          h5: '五级标题',
          h6: '六级标题',
        },
        imgTitleItem: {
          link: '添加链接',
          upload: '上传图片',
          clip2upload: '裁剪上传',
        },
        linkModalTips: {
          linkTitle: '添加链接',
          imageTitle: '添加图片',
          descLabel: '链接描述：',
          descLabelPlaceHolder: '请输入描述...',
          urlLabel: '链接地址：',
          urlLabelPlaceHolder: '请输入链接...',
          buttonOK: '确定',
        },
        clipModalTips: {
          title: '裁剪图片上传',
          buttonUpload: '上传',
        },
        copyCode: {
          text: '复制代码',
          successTips: '已复制！',
          failTips: '复制失败！',
        },
        mermaid: {
          flow: '流程图',
          sequence: '时序图',
          gantt: '甘特图',
          class: '类图',
          state: '状态图',
          pie: '饼图',
          relationship: '关系图',
          journey: '旅程图',
        },
        katex: {
          inline: '行内公式',
          block: '块级公式',
        },
        footer: {
          markdownTotal: '字数',
          scrollAuto: '同步滚动',
        },
      },
    },
  },
});
```

#### 🍘 mermaidTemplate

```js
import { config } from 'md-editor-rt';

config({
  editorConfig: {
    // mermaid模板
    mermaidTemplate: {
      // 流程图
      flow: `flow tempalte`,
      // 时序图
      sequence: `sequence template`,
      // 甘特图
      gantt: `gantt template`,
      // 类图
      class: `class template`,
      // 状态图
      state: `state template`,
      // 饼图
      pie: `pie template`,
      // 关系图
      relationship: `relationship template`,
      // 旅程图
      journey: `journey template`,
    },
  },
});
```

#### 🍥 renderDelay

```js
import { config } from 'md-editor-rt';

config({
  editorConfig: {
    // 输入渲染延迟（ms）
    renderDelay: 0,
  },
});
```

---

#### 🍥 zIndex

```js
import { config } from 'md-editor-rt';

config({
  editorConfig: {
    // 内部弹窗的zIndex
    zIndex: 2000,
  },
});
```

---

### 🥠 editorExtensions

类型如下，用于配置编辑器内部的扩展

```js
import { config } from 'md-editor-rt';

config({
  editorExtensions: { highlight: { js: 'https://xxx.cc' } },
});
```

```ts
export interface EditorExtensions {
  highlight?: {
    instance?: any;
    js?: string;
    css?: {
      [key: string]: {
        light: string;
        dark: string;
      };
    };
  };
  prettier?: {
    // >= 2.2.0
    prettierInstance?: any;
    parserMarkdownInstance?: any;

    standaloneJs?: string;
    parserMarkdownJs?: string;
  };
  cropper?: {
    instance?: any;
    js?: string;
    css?: string;
  };
  screenfull?: {
    instance?: any;
    js?: string;
  };
  mermaid?: {
    instance?: any;
    js?: string;
  };
  katex?: {
    instance?: any;
    js?: string;
    css?: string;
  };
}
```

---

### 🥠 editorExtensionsAttrs

同步添加 CDN 链接标签的上属性，类型与`editorExtensions`一直，值类型是`HTMLElementTagNameMap<script|link>` 内部提供所有链接的`integrity`值，使用方式如下：

```js
import { config } from 'md-editor-rt';

config({
  editorExtensionsAttrs: {
    highlight: {
      js: {
        className: 'hglh-js',
      },
      css: {
        atom: {
          light: {
            className: 'atom-light-css',
          },
          dark: {
            className: 'atom-dark-css',
          },
        },
      },
    },
  },
});
```

使用内置的基础属性配置示例：

```js
import { config, editorExtensionsAttrs } from 'md-editor-rt';

config({
  editorExtensionsAttrs,
});
```

!!! warning 提醒

不要尝试在 editorExtensionsAttrs 定义 script 的 src\onload\id，link 的 rel\href\id 它们会被默认值覆盖

!!!

---

### 🎨 mermaidConfig

mermaid 配置项，[配置详情](https://mermaid.js.org/config/schema-docs/config.html)

```js
import { config } from 'md-editor-rt';
config({
  mermaidConfig(base: any) {
    return {
      ...base,
      logLevel: 'error',
    };
  },
});
```

---

### 🔧 katexConfig

katex 配置项，[配置详情](https://katex.org/docs/options)

```js
import { config } from 'md-editor-rt';

config({
  katexConfig(base: any) {
    return {
      ...base,
      strict: false,
    };
  },
});
```

---

## 🪡 快捷键

主要以`CTRL`搭配对应功能英文单词首字母，冲突项添加`SHIFT`，再冲突替换为`ALT`。

!!! warning 注意事项

快捷键仅在输入框获取到焦点时可用！

!!!

| 键位                   | 功能       | 说明                                                          |
| ---------------------- | ---------- | ------------------------------------------------------------- |
| TAB                    | 空格       | 通过`tabWidth`属性预设 TAB 键位新增空格长度，默认 2，支持多行 |
| SHIFT + TAB            | 取消空格   | 同上，一次取消两个空格，支持多行                              |
| CTRL + C               | 复制       | 选中时复制选中内容，未选中时复制当前行内容                    |
| CTRL + X               | 剪切       | 选中时剪切选中内容，未选中时剪切当前行                        |
| CTRL + D               | 删除       | 选中时删除选中内容，未选中时删除当前行                        |
| CTRL + S               | 保存       | 触发编辑器的`onSave`回调                                      |
| CTRL + B               | 加粗       | `**加粗**`                                                    |
| CTRL + U               | 下划线     | `<u>下划线</u>`                                               |
| CTRL + I               | 斜体       | `*斜体*`                                                      |
| CTRL + 1-6             | 1-6 级标题 | `# 标题`                                                      |
| CTRL + ↑               | 上角标     | `<sup>上角标</sup>`                                           |
| CTRL + ↓               | 下角标     | `<sub>下角标</sub>`                                           |
| CTRL + O               | 有序列表   | `1. 有序列表`                                                 |
| CTRL + L               | 链接       | `[链接](https://github.com/imzbf)`                            |
| CTRL + Z               | 撤回       | 触发编辑器内内容撤回，与系统无关                              |
| CTRL + F               | 查找替换   |                                                               |
| CTRL + SHIFT + S       | 删除线     | `~删除线~`                                                    |
| CTRL + SHIFT + U       | 无序列表   | `- 无序列表`                                                  |
| CTRL + SHIFT + C       | 块级代码   | 多行代码块                                                    |
| CTRL + SHIFT + I       | 图片链接   | `![图片](https://github.com/imzbf)`                           |
| CTRL + SHIFT + Z       | 前进一步   | 触发编辑器内内容前进，与系统无关                              |
| CTRL + SHIFT + F       | 美化内容   |                                                               |
| CTRL + ALT + C         | 行内代码   | 行内代码块                                                    |
| CTRL + SHIFT + ALT + T | 表格       | `\|表格\|`                                                    |

## 🪤 内置组件

按需引用编辑器的扩展组件，例如：`import { DropdownToolbar } from 'md-editor-rt'`。

!!! info 内置属性提示

为了帮助开发者快速插入和使用编辑器的属性，编辑器组件已经默认向头部工具栏和尾部工具栏中的扩展组件添加了下面的属性的值（如果你也提供了，那么会优先使用你提供的内容），更详细的参考示例：[ExportPDF](https://github.com/imzbf/md-editor-extension/blob/main/packages/rt/components/ExportPDF/ExportPDF.tsx#L71)

| 名称         | defToolbars | defFooters |
| ------------ | ----------- | ---------- |
| insert       | √           | ×          |
| theme        | √           | √          |
| previewtheme | √           | ×          |
| codeTheme    | √           | ×          |
| language     | √           | √          |
| disabled     | √           | √          |

例子：

```jsx
const HeaderTool = (props) => {
  console.log('==', props);
  // == { insert: (...)=> {...}, theme: 'light', ... }

  return <NormalToolbar>触发</NormalToolbar>;
};

const toolbars = [0];
const defToolbars = [<HeaderTool key="key" />];

const MyEditor1 = () => {
  return <MdEditor toolbars={toolbars} defToolbars={defToolbars} />;
};

// ===================================

const FooterTool = (props) => {
  console.log('==', props);
  // == { theme: 'light', disabled: false, language: 'zh-CN' }

  return <NormalFooterToolbar>触发</NormalFooterToolbar>;
};

const footers = [0];
const defFooters = [<FooterTool key="key" />];

const MyEditor2 = () => {
  return <MdEditor footers={footers} defFooters={defFooters} />;
};
```

!!!

### 🐣 NormalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `children`: `ReactNode`，非必须，通常是个图标，用来展示在工具栏上。
  - ~~`trigger`~~: `ReactNode`，非必须，已废弃，同上。

- **events**

  - `onClick`: `(e: MouseEvent) => void`，必须，点击事件。

```jsx
import { useCallback, useState } from 'react';
import { MdEditor, NormalToolbar, InsertContentGenerator } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

interface MyToolbarProps {
  insert?: (generator: InsertContentGenerator) => void;
}

/**
 * `insert`方法会由编辑器自动向组件的组件注入。
 */
const MyToolbar = ({ insert = () => {} }: MyToolbarProps) => {
  const onClick = useCallback(() => {
    insert((selectedText) => {
      /**
       * targetValue    待插入内容
       * select         插入后是否自动选中内容，默认：true
       * deviationStart 插入后选中内容鼠标开始位置，默认：0
       * deviationEnd   插入后选中内容鼠标结束位置，默认：0
       */
      return {
        targetValue: `==${selectedText}==`,
        select: true,
        deviationStart: 0,
        deviationEnd: 0,
      };
    });
  }, [insert]);

  return (
    <NormalToolbar title="mark" onClick={onClick} key="mark-toolbar">
      <svg className="md-editor-icon" aria-hidden="true">
        <use xlinkHref="#icon-mark"></use>
      </svg>
    </NormalToolbar>
  );
};

export default () => {
  const [value, setValue] = useState('');

  return (
    <MdEditor
      modelValue={value}
      id="md-prev"
      toolbars={['bold', 0, '=', 'github']}
      defToolbars={[<MyToolbar />]}
      onChange={setValue}
    />
  );
};
```

[标记组件的源码](https://github.com/imzbf/md-editor-extension/blob/develop/packages/rt/components/Mark/Mark.tsx)

---

### 🐼 DropdownToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `visible`: `boolean`，必须，下拉状态。
  - `children`: `ReactNode`，非必须，通常是个图标，用来展示在工具栏上。
  - ~~`trigger`~~: `ReactNode`，非必须，已废弃，同上。
  - `overlay`: `ReactNode`，必须，下拉框中的内容。

- **events**

  - `onChange`: `(visible: boolean) => void`，必须，状态变化事件。

```jsx
import { useCallback, useState } from 'react';
import { MdEditor, DropdownToolbar } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

/**
 * `insert`方法会由编辑器自动向组件的组件注入。
 */
const MyToolbar = ({ insert = () => {} }) => {
  const [visible, setVisible] = useState(false);

  const onClick = useCallback(() => {
    insert((selectedText) => {
      /**
       * targetValue    待插入内容
       * select         插入后是否自动选中内容，默认：true
       * deviationStart 插入后选中内容鼠标开始位置，默认：0
       * deviationEnd   插入后选中内容鼠标结束位置，默认：0
       */
      return {
        targetValue: `==${selectedText}==`,
        select: true,
        deviationStart: 0,
        deviationEnd: 0,
      };
    });
  }, [insert]);

  return (
    <DropdownToolbar
      visible={visible}
      onChange={setVisible}
      overlay={
        <ul>
          <li onClick={onClick}>option 1</li>
          <li>option 2</li>
        </ul>
      }
      key="emoji-toolbar"
    >
      <svg className="md-editor-icon" aria-hidden="true">
        <use xlinkHref="#icon-emoji"></use>
      </svg>
    </DropdownToolbar>
  );
};

const toolbars = ['bold', 0, '=', 'github'];
const defToolbars = [<MyToolbar key="key" />];

export default () => {
  const [value, setValue] = useState('');

  return (
    <MdEditor
      modelValue={value}
      id="md-prev"
      toolbars={toolbars}
      defToolbars={defToolbars}
      onChange={setValue}
    />
  );
};
```

[Emoji 组件的源码](https://github.com/imzbf/md-editor-extension/blob/develop/packages/rt/components/Emoji/Emoji.tsx)

---

### 🦉 ModalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `modalTitle`: `ReactNode`，非必须，弹窗的标题。
  - `visible`: `boolean`，必须，弹窗显示状态。
  - `width`: `string`，非必须，弹窗宽度，默认`auto`。
  - `height`：`string`，同`width`。
  - `showAdjust`: `boolean`，非必须，是否显示弹窗全屏按钮。
  - `isFullscreen`: `boolean`，显示全屏按钮时必须，弹窗全屏状态。
  - `trigger`: `ReactNode`，必须，通常是个图标，用来展示在工具栏上。
  - `children`: `ReactNode`，必须，弹窗中的内容。
  - `className`: `string`，`^4.16.8`，非必须，类名。
  - `style`: `CSSProperties`，`^4.16.8`，非必须，样式。
  - `showMask`: `boolean`，`^4.16.8`，非必须，是否展示遮罩层，默认 true。

- **events**

  - `onClick`: `() => void`，必须，工具栏点击事件。
  - `onClose`：`() => void`，必须，弹窗点击关闭事件。
  - `onAdjust`：`(val: boolean) => void`，弹窗全屏按钮点击事件。

```jsx
import { useCallback, useState } from 'react';
import { MdEditor, ModalToolbar } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

/**
 * `insert`方法会由编辑器自动向组件的组件注入。
 */
const MyToolbar = ({ insert = () => {} }) => {
  const [visible, setVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const onClick = useCallback(() => {
    setVisible(true);
  }, []);

  const onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const onAdjust = useCallback(() => {
    setIsFullscreen((i) => !i);
  }, []);

  const insertHandler = useCallback(() => {
    insert((selectedText) => {
      /**
       * targetValue    待插入内容
       * select         插入后是否自动选中内容，默认：true
       * deviationStart 插入后选中内容鼠标开始位置，默认：0
       * deviationEnd   插入后选中内容鼠标结束位置，默认：0
       */
      return {
        targetValue: `==${selectedText}==`,
        select: true,
        deviationStart: 0,
        deviationEnd: 0,
      };
    });
  }, [insert]);

  return (
    <ModalToolbar
      visible={visible}
      isFullscreen={isFullscreen}
      showAdjust
      title="hover-title"
      modalTitle="modalTitle"
      width="870px"
      height="600px"
      onClick={onClick}
      onClose={onClose}
      onAdjust={onAdjust}
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-read"></use>
        </svg>
      }
    >
      <div
        style={{
          height: '100%',
          padding: '20px',
          overflow: 'auto',
        }}
      >
        <button onClick={insertHandler}>click me</button>
      </div>
    </ModalToolbar>
  );
};

const toolbars = ['bold', 0, '=', 'github'];
const defToolbars = [<MyToolbar key="key" />];

export default () => {
  const [value, setValue] = useState('');
  return (
    <MdEditor
      modelValue={value}
      id="md-prev"
      toolbars={toolbars}
      defToolbars={defToolbars}
      onChange={setValue}
    />
  );
};
```

[ExportPDF 组件的源码](https://github.com/imzbf/md-editor-extension/blob/develop/packages/rt/components/ExportPDF/ExportPDF.tsx)

---

### 🐻 MdCatalog

- **props**

  - `editorId`: `string`，必须，对应编辑器的`id`，在内部注册目录变化监听事件。
  - `className`: `string`，非必须，目录组件最外层类名。
  - `mdHeadingId`: `mdHeadingId`，非必须，特殊化编辑器标题的算法，与编辑器相同。
  - `scrollElement`: `string | HTMLElement`，非必须，为字符时应是一个元素选择器。仅预览模式中，整页滚动时，设置为`document.documentElement`。
  - `theme`: `'light' | 'dark'`，非必须，当需要切换主题时提供，同编辑器的`theme`。
  - `offsetTop`: `number`，非必须，标题距离顶部该像素时高亮当前目录项，默认 20 像素。
  - `scrollElementOffsetTop`: `number`，非必须，滚动区域的固定顶部高度，默认 0。

- **events**

  - `onClick`: `(e: MouseEvent, t: TocItem) => void`，非必须，导航点击事件。
  - `onActive`: `(heading: HeadList | undefined) => void`，非必须，高亮的标题变化事件。

> `scrollElement`说明：仅预览下，该元素必须已定位的并且支持滚动。

```jsx
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement,
  });

  return (
    <>
      {/* 保证editorId是相同的 */}
      <MdPreview id={editorId} modelValue={state.text} />
      <MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
    </>
  );
};
```

---

### 🛸 MdModal

编辑器内部的弹窗组件，它通常配合下拉工具栏组件使用。

- **props**

  - `title`: `ReactNode`，非必须，弹窗标题栏。
  - `visible`: `boolean`，必须，弹窗显示状态。
  - `width`: `string`，非必须，弹窗宽度，默认`auto`。
  - `height`: `string`，同`width`。
  - `showAdjust`: `boolean`，非必须，是否显示弹窗全屏按钮。
  - `isFullscreen`: `boolean`，显示全屏按钮时必须，弹窗全屏状态。
  - `children`: `ReactNode`，非必须，弹窗显示的内容。
  - `className`: `string`，非必须，类名。
  - `style`: `CSSProperties`，非必须，样式。
  - `showMask`: `boolean`，`^4.16.8`，非必须，是否展示遮罩层，默认 true。

- **events**

  - `onClose`: `() => void`，必须，弹窗点击关闭事件。
  - `onAdjust`: `(val: boolean) => void`，弹窗全屏按钮点击事件。

```jsx
import { useCallback, useState } from 'react';
import { MdEditor, DropdownToolbar, MdModal } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

/**
 * `insert`方法会由编辑器自动向组件的组件注入。
 */
const MyToolbar = () => {
  const [visible, setVisible] = useState(false);
  const [mVisible, setMvisible] = useState(false);

  const onClick = useCallback(() => {
    setMvisible(true);
  }, []);

  const onClose = useCallback(() => {
    setMvisible(false);
  }, []);

  return (
    <>
      <DropdownToolbar
        visible={visible}
        onChange={setVisible}
        overlay={
          <ul>
            <li onClick={onClick}>option 1</li>
            <li>option 2</li>
          </ul>
        }
        key="emoji-toolbar"
      >
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      </DropdownToolbar>
      <MdModal title="title" visible={mVisible} onClose={onClose}>
        Content, Content
      </MdModal>
    </>
  );
};

const toolbars = ['bold', 0, '=', 'github'];
const defToolbars = [<MyToolbar key="key" />];

export default () => {
  const [value, setValue] = useState('');

  return (
    <MdEditor
      modelValue={value}
      id="md-prev"
      toolbars={toolbars}
      defToolbars={defToolbars}
      onChange={setValue}
    />
  );
};
```

---

### 🛸 NormalFooterToolbar

通用的页脚工具组件

- **events**

  - `onClick`: `(e: MouseEvent) => void`，非必须，点击事件。

- **slots**

  - `children`: `ReactNode`，必须，内容。

```jsx
import { MdEditor, NormalFooterToolbar } from 'md-editor-rt';

const FooterTool = (props) => {
  return <NormalFooterToolbar>触发</NormalFooterToolbar>;
};

const footers = [0];
const defFooters = [<FooterTool key="key" />];

export default () => {
  return <MdEditor footers={footers} defFooters={defFooters} />;
};
```

---

## 🪤 内部配置

```js
import {
  allToolbar,
  allFooter,
  zh_CN,
  en_US,
  editorExtensionsAttrs,
} from 'md-editor-rt';

console.log(allToolbar, allFooter, zh_CN, en_US, editorExtensionsAttrs);
```

## 📦 内部工具

### 🧹 clearSideEffects

`>=5.0.0`

清空组件带来的副作用，例如：使用 CDN 嵌入的链接，为了保证多个组件能够正常使用，组件在卸载时不会主动移除

```js
import { clearSideEffects } from 'md-editor-rt';

clearSideEffects();
```

!!! warning

这会删除掉页面中的 CDN 引用，如果当前页面还存在该组件实例，请不要这样做！

!!!

### XSSPlugin

`>=5.0.0`

使用示例：[添加 xss 扩展](https://imzbf.github.io/md-editor-rt/zh-CN/demo#%F0%9F%94%92%20添加%20xss%20扩展)

## ✍️ 编辑此页面

[doc-zh-CN](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/doc-zh-CN.md)
