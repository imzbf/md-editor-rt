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
            UrlLablePlaceHolder: '请输入链接...',
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
        <svg className="md-icon" aria-hidden="true">
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
        <svg className="md-icon" aria-hidden="true">
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
        <svg className="md-icon" aria-hidden="true">
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
