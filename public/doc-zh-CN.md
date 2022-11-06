> 在线尝试示例：[传送门](https://codesandbox.io/s/elated-khorana-65jmr)。

## 🤯 Props 说明

这是组件最重要的一部分内容，`md-editor-rt`的属性参数如下：

### 📃 modelValue

- **类型**：`string`
- **默认值**：`''`

  编辑的内容。

  ```jsx
  <MdEditor modelValue="xxx" />
  ```

### 🛍 theme

- **类型**：`'light' | 'dark'`
- **默认值**：`'light'`

  编辑器主题。

  ```jsx
  <MdEditor theme="dark" />
  ```

### 🎀 className

- **类型**：`string`
- **默认值**：`''`

  编辑器`className`。

### 🤏🏼 historyLength

- **类型**：`number`
- **默认值**：`10`

  最大记录操作数（太大会占用内存）。

### 💻 pageFullScreen

- **类型**：`boolean`
- **默认值**：`false`

  页面内全屏。

### 📱 preview

- **类型**：`boolean`
- **默认值**：`true`

  是否显示预览。

### 📀 htmlPreview

- **类型**：`boolean`
- **默认值**：`false`

  是否显示 html 预览，为`true`时需设置`preview=false`。

  ```jsx
  <MdEditor htmlPreview preview={false} />
  ```

### 📺 previewOnly

- **类型**：`boolean`
- **默认值**：`false`

  仅预览模式，不显示 bar 和编辑框，只支持初始化设置。

  ```jsx
  <MdEditor previewOnly />
  ```

### 🔤 language

- **类型**：`string`
- **默认值**：`'zh-CN'`

  内置中英文(`'zh-CN'`, `'en-US'`)，可自行扩展其他语言，同时可覆盖内置的中英文。

  你也可以使用现成的扩展语言：[md-editor-extension](https://github.com/imzbf/md-editor-extension)。使用及贡献方式见扩展库文档~

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
    'htmlPreview',
    'catalog',
    'github'
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
    '源码地址'
  ];
  ```

### 🧱 toolbarsExclude

- **类型**：`Array`
- **默认值**：`[]`

  选择性不展示工具栏，内容同上。

### 🪒 noPrettier

- **类型**：`boolean`
- **默认值**：`false`

  是否启用 prettier 优化 md 内容。

### 🎲 editorId

- **类型**：`string`
- **默认值**：`'md-editor-rt'`

  编辑器唯一标识，非必须项，服务端渲染时，防止产生服务端与客户端渲染内容不一致错误提示，以及单页面多编辑器时做区别。

### 🤏 tabWidth

- **类型**：`number`
- **默认值**：`2`

  编辑器一个 TAB 键等于空格数。

### 🔢 showCodeRowNumber

- **类型**：`boolean`
- **默认值**：`false`

  代码块是否显示行号。

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
  <MdEditor preview-theme="xxx" />
  ```

  参考[markdown-theme](https://github.com/imzbf/markdown-theme)项目。

### 🎅🏻 style

- **类型**：`CSSProperties`
- **默认值**：`{}`

  编辑器内联样式。

### 📅 tableShape

- **类型**：`[number, number]`
- **默认值**：`[6, 4]`

  标题栏添加表格时，预设待选表格大小，第一个代表最大列数，第二个代表最大行数。

```jsx
<MdEditor tableShape={[8, 4]}>
```

![表格预设大小预览](https://imzbf.github.io/md-editor-rt/imgs/20211216165424.png)

### ☝️ noMermaid

- **类型**：`boolean`
- **默认值**：`false`

  如果你不希望使用图表展示内容，可以设置关闭。

```jsx
<MdEditor noMermaid />
```

### 🪧 placeholder

- **类型**：`string`
- **默认值**：`''`

  啊这-\_-！

### ❌ noKatex

- **类型**：`boolean`
- **默认值**：`false`

  如果你不希望使用数学公式展示内容，可以设置关闭。

```jsx
<MdEditor noKatex />
```

### 💪 defToolbars

- **类型**：`Array<ReactElement>`
- **默认值**：`[]`

  自定义工具栏插槽，通过使用内置的`NormalToolbar`普通点击触发事件组件，`DropdownToolbar`下拉点击触发事件组件，和`ModalToolbar`弹窗组件进行扩展。将`defToolbars`插槽中的组件下标穿插在`toolbars`实现展示（这并不规范）

  ```jsx
  import MdEditor from 'md-editor-rt';

  const NormalToolbar = MdEditor.NormalToolbar;

  const handler = () => {
    console.log('NormalToolbar clicked!');
  };

  export default () => {
    return (
      <MdEditor
        modelValue=""
        toolbars={['github', '=', 0]}
        defToolbars={[
          <NormalToolbar
            title="mark"
            onClick={handler}
            trigger={
              <svg className="md-editor-icon" aria-hidden="true">
                <use xlinkHref="#icon-mark"></use>
              </svg>
            }
          />
        ]}
      />
    );
  };
  ```

  ![普通扩展工具栏](https://imzbf.github.io/md-editor-rt/imgs/normal-toolbar.gif)

  ![下拉扩展工具栏](https://imzbf.github.io/md-editor-rt/imgs/dropdown-toolbar.gif)

  扩展组件属性参考**内置组件**，使用示例参见[文档分支](https://github.com/imzbf/md-editor-rt/tree/docs/src/components)，提供**标记**、**表情**和**弹窗预览**扩展组件。

### 🦉 codeTheme

- **类型**：`'atom'|'a11y'|'github'|'gradient'|'kimbie'|'paraiso'|'qtcreator'|'stackoverflow'`
- **默认值**：`'atom'`

  代码块高亮样式名称。

  你可以添加自己的样式，把该属性设置为你想要的即可，方式如下：

  1. 配置样式链接

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    editorExtensions: {
      highlight: {
        css: {
          atom: {
            light:
              'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-light.min.css',
            dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/atom-one-dark.min.css'
          },
          xxx: {
            light:
              'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-light.css',
            dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/xxx-dark.css'
          }
        }
      }
    }
  });
  ```

  2. 设置`codeTheme`

  ```jsx
  <MdEditor codeTheme="xxx" />
  ```

### 🎱 markedHeadingId

- **类型**：`(text: string, level: number, index: number) => string`
- **默认值**：`(text) => text`

  构造标题`ID`的生成方式，在使用`MdEditor.config`定义了`renderer.heading`后，避免目录导航等失效。

  例：

  1. 配置 renderer

  ```js
  import MdEditor from 'md-editor-rt';

  const generateId = (_text, _level, index) => `heading-${index}`;

  MdEditor.config({
    markedRenderer(renderer) {
      renderer.heading = (text, level) => {
        const id = generateId(text, level);
        return `<h${level} id="${id}">${text}</h${level}>`;
      };
      return renderer;
    }
  });
  ```

  2. 配置`markedHeadingId`

  ```jsx
  <MdEditor markedHeadingId={generateId} />
  ```

### 🐣 sanitize

- **类型**：`(html: string) => string`
- **默认值**：`(html) => html`

  在每次生成 html 后，通过该方法移除危险内容，比如 xss 相关，当你很确定你的内容不会出现类似情况时，不必设置它。

  使用`sanitize-html`演示

  ```js
  import sanitizeHtml from 'sanitize-html';

  const sanitize = (html) => sanitizeHtml(html);
  ```

  ```jsx
  <MdEditor sanitize={sanitize} />
  ```

  > 为什么不内置到编辑器：由于类似编辑器大多属于自行处理文本，自身即可确认内容是否安全，并不需要该功能。

### 🦶 footers

- **类型**：`Array<'markdownTotal' \| '=' \| 'scrollSwitch' \| number>`
- **默认值**：`['markdownTotal', '=', 'scrollSwitch']`

  页脚显示内容，`'='`左右分割，设置为`[]`不显示页脚。

### ⛵️ scrollAuto

- **类型**：`boolean`
- **默认值**：`true`

  默认左右同步滚动状态。

### 🦿 defFooters

- **类型**：`Array<string \| ReactElement>`
- **默认值**：`[]`

  自定义扩展页脚。

  示例代码见[文档页源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx)。

### 🤞🏼 noIconfont

- **类型**：`boolean`
- **默认值**：`true`

  不插入 iconfont 链接，你可以[下载](https://at.alicdn.com/t/font_2605852_pqekijay2ij.js)到本地自行引入。

  ```jsx
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  import '/assets/iconfont.js';

  export default () => {
    return <MdEditor noIconfont />;
  };
  ```

### 💅 formatCopiedText

- **类型**：`(text: string) => string`
- **默认值**：`(text) => text`

  格式化复制代码

  ```jsx
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const formatCopiedText = (text: string) => {
      return `${text}  - from md-editor-rt`;
    };

    return <MdEditor formatCopiedText={formatCopiedText} />;
  };
  ```

### 🥹 noUploadImg

- **type**: `boolean`
- **default**: `false`

  工具栏不显示上传图片入口。

  ```jsx
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    return <MdEditor noUploadImg />;
  };
  ```

## 🪢 绑定事件

目前支持的内容如下：

### 📞 onChange

- **类型**：`(v: string) => void`

  内容变化事件（当前与`textare`的`oninput`事件绑定，每输入一个单字即会触发）。

### 💾 onSave

- **类型**：`(v: string) => void`

  保存事件，快捷键与保存按钮均会触发。

### 📸 onUploadImg

- **类型**：`(files: Array<File>, callback: (urls: Array<string>) => void) => void`

  上传图片事件，弹窗会等待上传结果，务必将上传后的 urls 作为 callback 入参回传。

```js
async onUploadImg(files, callback) {
  const res = await Promise.all(
    files.map((file) => {
      return new Promise((rev, rej) => {
        const form = new FormData();
        form.append('file', file);

        axios
          .post('/api/img/upload', form, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => item.data.url));
}
```

### 🚁 onHtmlChanged

- **类型**：`(h: string) => void`

  html 变化回调事件，用于获取预览 html 代码。

### 🗒 onGetCatalog

- **类型**：`(list: HeadList[]) => void`

  动态获取`markdown`目录。

### 💀 onError

- **类型**：`(err: { name: string; message: string;}) => void`

  捕获执行错误事件，目前支持`Cropper`、`fullScreen`、`prettier`实例未加载完成操作错误。

  ```js
  const onError = (err) => {
    alert(err.message);
  };
  ```

  ```jsx
  <MdEditor onError={onError} />
  ```

## 💴 配置编辑器

使用`MdEditor.config(option: ConfigOption)`方法，可以对内部的`renderer`定制。

- markedRenderer: `(renderer: RewriteRenderer) => RewriteRenderer`

  设置链接在新窗口打开 🌰

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedRenderer(renderer) {
      renderer.link = (href, title, text) => {
        return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
      };

      return renderer;
    }
  });
  ```

  设置`heading-${index}`标题 ID 🌰

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedRenderer(renderer) {
      renderer.heading = (text, level, raw, s, index) => {
        return `<h${level} id="heading-${index}">${text}</h${level}>`;
      };

      return renderer;
    }
  });
  ```

  > 参考：https://marked.js.org/using_pro#renderer，RewriteRenderer 继承了 Renderer 并重写了 heading 方法，提供了第 5 入参 index。

- markedExtensions: `Array<marked.TokenizerExtension & marked.RendererExtension>`

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedExtensions: [your extension]
  });
  ```

  > 参考：https://marked.js.org/using_pro#extensions

  [文档示例源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/main.tsx)

- markedOptions: `marked.MarkedOptions`，设置输入空白行不渲染出来 🌰：

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedOptions: { breaks: false }
  });
  ```

  > 参考：https://marked.js.org/using_advanced#options

- editorConfig: 编辑器常规配置，语言、`mermaid`默认模板、渲染延迟：

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
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
            htmlPreview: 'html代码预览',
            catalog: '目录',
            github: '源码地址'
          },
          titleItem: {
            h1: '一级标题',
            h2: '二级标题',
            h3: '三级标题',
            h4: '四级标题',
            h5: '五级标题',
            h6: '六级标题'
          },
          imgTitleItem: {
            link: '添加链接',
            upload: '上传图片',
            clip2upload: '裁剪上传'
          },
          linkModalTips: {
            title: '添加',
            descLable: '链接描述：',
            descLablePlaceHolder: '请输入描述...',
            urlLable: '链接地址：',
            urlLablePlaceHolder: '请输入链接...',
            buttonOK: '确定'
          },
          clipModalTips: {
            title: '裁剪图片上传',
            buttonUpload: '上传'
          },
          copyCode: {
            text: '复制代码',
            successTips: '已复制！',
            failTips: '复制失败！'
          },
          mermaid: {
            flow: '流程图',
            sequence: '时序图',
            gantt: '甘特图',
            class: '类图',
            state: '状态图',
            pie: '饼图',
            relationship: '关系图',
            journey: '旅程图'
          },
          katex: {
            inline: '行内公式',
            block: '块级公式'
          },
          footer: {
            markdownTotal: '字数',
            scrollAuto: '同步滚动'
          }
        },
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
          journey: `journey template`
        },
        // 输入渲染延迟（ms）
        renderDelay: 0
      }
    }
  });
  ```

- editorExtensions: 类型如下，用于配置编辑器内部的扩展

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    editorExtensions: { iconfont: 'https://xxx.cc' }
  });
  ```

  <details>
    <summary>[EditorExtensions]</summary>

  ```ts
  import MdEditor from 'md-editor-rt';

  interface EditorExtensions {
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
    iconfont?: string;
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

  </details>

## 🪡 快捷键

主要以`CTRL`搭配对应功能英文单词首字母，冲突项添加`SHIFT`，再冲突替换为`ALT`。

| 键位 | 功能 | 说明 |
| --- | --- | --- |
| TAB | 空格 | 通过`tabWidth`属性预设 TAB 键位新增空格长度，默认 2，支持多行 |
| SHIFT + TAB | 取消空格 | 同上，一次取消两个空格，支持多行 |
| CTRL + C | 复制 | 选中时复制选中内容，未选中时复制当前行内容 |
| CTRL + X | 剪切 | 选中时剪切选中内容，未选中时剪切当前行 |
| CTRL + D | 删除 | 选中时删除选中内容，未选中时删除当前行 |
| CTRL + S | 保存 | 触发编辑器的`onSave`回调 |
| CTRL + B | 加粗 | `**加粗**` |
| CTRL + U | 下划线 | `<u>下划线</u>` |
| CTRL + I | 斜体 | `*斜体*` |
| CTRL + 1-6 | 1-6 级标题 | `# 标题` |
| CTRL + ↑ | 上角标 | `<sup>上角标</sup>` |
| CTRL + ↓ | 下角标 | `<sub>下角标</sub>` |
| CTRL + Q | 引用 | `> 引用` |
| CTRL + O | 有序列表 | `1. 有序列表` |
| CTRL + L | 链接 | `[链接](https://imzbf.cc)` |
| CTRL + Z | 撤回 | 触发编辑器内内容撤回，与系统无关 |
| CTRL + SHIFT + S | 删除线 | `~删除线~` |
| CTRL + SHIFT + U | 无序列表 | `- 无序列表` |
| CTRL + SHIFT + C | 块级代码 | 多行代码块 |
| CTRL + SHIFT + I | 图片链接 | `![图片](https://imzbf.cc)` |
| CTRL + SHIFT + Z | 前进一步 | 触发编辑器内内容前进，与系统无关 |
| CTRL + SHIFT + F | 美化内容 |  |
| CTRL + ALT + C | 行内代码 | 行内代码块 |
| CTRL + SHIFT + ALT + T | 表格 | `\|表格\|` |

## 🪤 内置组件

扩展组件作为编辑器组件的属性值来使用，例如：`MdEditor.DropdownToolbar`。

### 🐣 NormalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。

- **events**

  - `onClick`: `(e: MouseEvent) => void`，必须，点击事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.NormalToolbar
      title="标记"
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
      onClick={console.log}
      key="mark-toolbar"
    />
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/MarkExtension/index.tsx)

### 🐼 DropdownToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `visible`: `boolean`，必须，下拉状态。

- **events**

  - `onChange`: `(visible: boolean) => void`，必须，状态变化事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。
  - `overlay`: `string | ReactElement`，必须，下拉框中的内容。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.DropdownToolbar
      visible={emojiVisible}
      onChange={setEmojiVisible}
      overlay={
        <div className="emoji-container">
          <ol className="emojis">
            {emojis.map((emoji, index) => (
              <li
                key={`emoji-${index}`}
                onClick={() => {
                  emojiHandler(emoji);
                }}
              >
                {emoji}
              </li>
            ))}
          </ol>
        </div>
      }
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      }
      key="emoji-toolbar"
    />
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/EmojiExtension/index.tsx)

### 🦉 ModalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `modalTitle`: `string`，非必须，弹窗的标题。
  - `visible`: `boolean`，必须，弹窗显示状态。
  - `width`: `string`，非必须，弹窗宽度，默认`auto`。
  - `height`：`string`，同`width`。
  - `showAdjust`: `boolean`，非必须，是否显示弹窗全屏按钮。
  - `isFullscreen`: `boolean`，显示全屏按钮时必须，弹窗全屏状态。

- **events**

  - `onClick`: `() => void`，必须，工具栏点击事件。
  - `onClose`：`() => void`，必须，弹窗点击关闭事件。
  - `onAdjust`：`(val: boolean) => void`，弹窗全屏按钮点击事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。
  - `overlay`: `string | ReactElement`，必须，下拉框中的内容。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.ModalToolbar
      visible={state.visible}
      isFullscreen={state.modalFullscreen}
      showAdjust
      title="弹窗预览"
      modalTitle="编辑预览"
      width="870px"
      height="600px"
      onClick={() => {
        setState({
          ...state,
          visible: true
        });
      }}
      onClose={() => {
        setState({
          ...state,
          visible: false
        });
      }}
      onAdjust={() => {
        setState({
          ...state,
          modalFullscreen: !state.modalFullscreen
        });
      }}
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
          overflow: 'auto'
        }}
      >
        <MdEditor
          theme={store.theme}
          language={store.lang}
          previewTheme={store.previewTheme}
          codeTheme={store.codeTheme}
          editorId="edit2preview"
          previewOnly
          modelValue={props.mdText}
        />
      </div>
    </MdEditor.ModalToolbar>
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/ReadExtension/index.tsx)

### 🐻 MdCatalog

`Editor.MdCatalog`

- **props**

  - `editorId`: `string`，必须，对应编辑器的`editorId`，在内部注册目录变化监听事件。
  - `className`: `string`，非必须，目录组件最外层类名。
  - `markedHeadingId`: `MarkedHeadingId`，非必须，特殊化编辑器标题的算法，与编辑器相同。
  - `scrollElement`: `string | HTMLElement`，非必须，为字符时应是一个元素选择器。仅预览模式中，整页滚动时，设置为`document.documentElement`。
  - `theme`: `'light' | 'dark'`，非必须，当需要切换主题时提供，同编辑器的`theme`。
  - `offsetTop`: `number`，非必须，标题距离顶部该像素时高亮当前目录项，默认 20 像素。

- **events**

  - `onClick`: `(e: MouseEvent, t: TocItem) => void`，非必须，导航点击事件。

> `scrollElement`说明：仅预览下，该元素必须已定位的并且支持滚动。

```jsx
const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement
  });

  return (
    <>
      <MdEditor modelValue={state.text} editorId={editorId} previewOnly />
      <MdEditor.MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
    </>
  );
};
```

## ✍️ 编辑此页面

[doc-zh-CN](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/doc-zh-CN.md)

## 🪡 快捷键

主要以`CTRL`搭配对应功能英文单词首字母，冲突项添加`SHIFT`，再冲突替换为`ALT`。

| 键位 | 功能 | 说明 |
| --- | --- | --- |
| TAB | 空格 | 通过`tabWidth`属性预设 TAB 键位新增空格长度，默认 2，支持多行 |
| SHIFT + TAB | 取消空格 | 同上，一次取消两个空格，支持多行 |
| CTRL + C | 复制 | 选中时复制选中内容，未选中时复制当前行内容 |
| CTRL + X | 剪切 | 选中时剪切选中内容，未选中时剪切当前行 |
| CTRL + D | 删除 | 选中时删除选中内容，未选中时删除当前行 |
| CTRL + S | 保存 | 触发编辑器的`onSave`回调 |
| CTRL + B | 加粗 | `**加粗**` |
| CTRL + U | 下划线 | `<u>下划线</u>` |
| CTRL + I | 斜体 | `*斜体*` |
| CTRL + 1-6 | 1-6 级标题 | `# 标题` |
| CTRL + ↑ | 上角标 | `<sup>上角标</sup>` |
| CTRL + ↓ | 下角标 | `<sub>下角标</sub>` |
| CTRL + Q | 引用 | `> 引用` |
| CTRL + O | 有序列表 | `1. 有序列表` |
| CTRL + L | 链接 | `[链接](https://imzbf.cc)` |
| CTRL + Z | 撤回 | 触发编辑器内内容撤回，与系统无关 |
| CTRL + SHIFT + S | 删除线 | `~删除线~` |
| CTRL + SHIFT + U | 无序列表 | `- 无序列表` |
| CTRL + SHIFT + C | 块级代码 | 多行代码块 |
| CTRL + SHIFT + I | 图片链接 | `![图片](https://imzbf.cc)` |
| CTRL + SHIFT + Z | 前进一步 | 触发编辑器内内容前进，与系统无关 |
| CTRL + SHIFT + F | 美化内容 |  |
| CTRL + ALT + C | 行内代码 | 行内代码块 |
| CTRL + SHIFT + ALT + T | 表格 | `\|表格\|` |

## 🪤 内置组件

扩展组件作为编辑器组件的属性值来使用，例如：`MdEditor.DropdownToolbar`。

### 🐣 NormalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。

- **events**

  - `onClick`: `(e: MouseEvent) => void`，必须，点击事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.NormalToolbar
      title="标记"
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
      onClick={console.log}
      key="mark-toolbar"
    />
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/MarkExtension/index.tsx)

### 🐼 DropdownToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `visible`: `boolean`，必须，下拉状态。

- **events**

  - `onChange`: `(visible: boolean) => void`，必须，状态变化事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。
  - `overlay`: `string | ReactElement`，必须，下拉框中的内容。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.DropdownToolbar
      visible={emojiVisible}
      onChange={setEmojiVisible}
      overlay={
        <div className="emoji-container">
          <ol className="emojis">
            {emojis.map((emoji, index) => (
              <li
                key={`emoji-${index}`}
                onClick={() => {
                  emojiHandler(emoji);
                }}
              >
                {emoji}
              </li>
            ))}
          </ol>
        </div>
      }
      trigger={
        <svg className="md-editor-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      }
      key="emoji-toolbar"
    />
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/EmojiExtension/index.tsx)

### 🦉 ModalToolbar

- **props**

  - `title`: `string`，非必须，作为工具栏上的 hover 提示。
  - `modalTitle`: `string`，非必须，弹窗的标题。
  - `visible`: `boolean`，必须，弹窗显示状态。
  - `width`: `string`，非必须，弹窗宽度，默认`auto`。
  - `height`：`string`，同`width`。
  - `showAdjust`: `boolean`，非必须，是否显示弹窗全屏按钮。
  - `isFullscreen`: `boolean`，显示全屏按钮时必须，弹窗全屏状态。

- **events**

  - `onClick`: `() => void`，必须，工具栏点击事件。
  - `onClose`：`() => void`，必须，弹窗点击关闭事件。
  - `onAdjust`：`(val: boolean) => void`，弹窗全屏按钮点击事件。

- **slots**

  - `trigger`: `string | ReactElement`，必须，通常是个图标，用来展示在工具栏上。
  - `overlay`: `string | ReactElement`，必须，下拉框中的内容。

```jsx
<MdEditor
  modelValue=""
  editorId="md-prev"
  defToolbars={[
    <MdEditor.ModalToolbar
      visible={state.visible}
      isFullscreen={state.modalFullscreen}
      showAdjust
      title="弹窗预览"
      modalTitle="编辑预览"
      width="870px"
      height="600px"
      onClick={() => {
        setState({
          ...state,
          visible: true
        });
      }}
      onClose={() => {
        setState({
          ...state,
          visible: false
        });
      }}
      onAdjust={() => {
        setState({
          ...state,
          modalFullscreen: !state.modalFullscreen
        });
      }}
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
          overflow: 'auto'
        }}
      >
        <MdEditor
          theme={store.theme}
          language={store.lang}
          previewTheme={store.previewTheme}
          codeTheme={store.codeTheme}
          editorId="edit2preview"
          previewOnly
          modelValue={props.mdText}
        />
      </div>
    </MdEditor.ModalToolbar>
  ]}
/>
```

[获取使用源码](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/ReadExtension/index.tsx)

### 🐻 MdCatalog

`Editor.MdCatalog`

- **props**

  - `editorId`: `string`，必须，对应编辑器的`editorId`，在内部注册目录变化监听事件。
  - `className`: `string`，非必须，目录组件最外层类名。
  - `markedHeadingId`: `MarkedHeadingId`，非必须，特殊化编辑器标题的算法，与编辑器相同。
  - `scrollElement`: `string | HTMLElement`，非必须，为字符时应是一个元素选择器。仅预览模式中，整页滚动时，设置为`document.documentElement`。
  - `theme`: `'light' | 'dark'`，非必须，当需要切换主题时提供，同编辑器的`theme`。

- **events**

  - `onClick`: `(e: MouseEvent, t: TocItem) => void`，非必须，导航点击事件。

> `scrollElement`说明：仅预览下，该元素必须已定位的并且支持滚动。

```jsx
const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# 标题',
    scrollElement: document.documentElement
  });

  return (
    <>
      <MdEditor modelValue={state.text} editorId={editorId} previewOnly />
      <MdEditor.MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
    </>
  );
};
```

## ✍️ 编辑此页面

[doc-zh-CN](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/doc-zh-CN.md)
