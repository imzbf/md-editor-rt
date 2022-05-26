> The latest version: [${EDITOR_VERSION}](https://github.com/imzbf/md-editor-rt/releases/tag/v${EDITOR_VERSION}), Use it online: [Go](https://codesandbox.io/s/elated-khorana-65jmr)

## 🤯 Props

### 📃 modelValue

- **type**: `String`
- **default**: `''`
- **description**: Markdown content.

### 🛍 theme

- **type**: `'light' | 'dark'`
- **default**: `'light'`
- **description**: Editor's theme.

```js
<Editor theme="dark" />
```

### 🎀 editorClass

- **type**: `String`
- **default**: `''`
- **description**: Editor's `class`.

### 🧸 hljs

- **type**: `Object`
- **default**: `null`
- **description**: `Highlight` instance, editor will not insert script of it, but you need to import `highlight` code style by yourself.

### 🧸 highlightJs

- **type**: `String`
- **default**: [highlight.js@11.2.0](https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js)
- **description**: HighlightJs url.

### 🧸 highlightCss

- **type**: `String`
- **default**: [atom-one-dark@11.2.0](https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/atom-one-dark.css)
- **description**: `Highlight` code style url.

### 🤏🏼 historyLength

- **type**: `Number`
- **default**: `10`
- **description**: The max length of history(if it is too big, editor will use more `RAM`).

### 💻 pageFullScreen

- **type**: `Boolean`
- **default**: `false`
- **description**: Screenfull in web page.

### 📱 preview

- **type**: `Boolean`
- **default**: `true`
- **description**: Preview content in editor.

### 📀 htmlPreview

- **type**: `Boolean`
- **default**: `false`
- **description**: Preview html in editor.

### 📺 previewOnly

- **type**: `Boolean`
- **default**: `false`
- **description**: Only render article content, no toolbar, no edit area.

### 🔤 language

- **type**: `String`
- **default**: `'zh-CN'`
- **description**: Build-in language('zh-CN','en-US').

### 🔤 languageUserDefined

- **type**: `Object`
- **default**: `{key: StaticTextDefaultValue}`
- **description**: Expand language,update `language` api to your key 🤨

```
export interface ToolbarTips {
  bold?: string;
  underline?: string;
  italic?: string;
  strikeThrough?: string;
  title?: string;
  sub?: string;
  sup?: string;
  quote?: string;
  unorderedList?: string;
  orderedList?: string;
  codeRow?: string;
  code?: string;
  link?: string;
  image?: string;
  table?: string;
  mermaid?: string;
  katex?: string;
  revoke?: string;
  next?: string;
  save?: string;
  prettier?: string;
  pageFullscreen?: string;
  fullscreen?: string;
  catalog?: string;
  preview?: string;
  htmlPreview?: string;
  github?: string;
  '-'?: string;
  '='?: string;
}

export interface StaticTextDefaultValue {
  toolbarTips?: ToolbarTips;
  titleItem?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  imgTitleItem?: {
    link: string;
    upload: string;
    clip2upload: string;
  };
  linkModalTips?: {
    title?: string;
    descLable?: string;
    descLablePlaceHolder?: string;
    urlLable?: string;
    UrlLablePlaceHolder?: string;
    buttonOK?: string;
  };
  clipModalTips?: {
    title?: string;
    buttonUpload?: string;
  };
  copyCode?: {
    text?: string;
    tips?: string;
  };
  mermaid?: {
    flow?: string;
    sequence?: string;
    gantt?: string;
    class?: string;
    state?: string;
    pie?: string;
    relationship?: string;
    journey?: string;
  };
  // 1.4.0
  katex?: {
    // formula inline
    inline: string;
    // formula block
    block: string;
  };
}
```

### 🧱 toolbars

- **type**: `Array`
- **default**: `[all]`
- **description**: Show some item of toolbars, all keys.

You can sort the toolbar as you like, split tools by `'-'`, the left and right toolbars are divided by `'='`！

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
```

### 🧱 toolbarsExclude

- **type**: `Array`
- **default**: `[]`
- **description**: Don't show some item of toolbars, all keys.

### 🪒 prettier

- **type**: `Boolean`
- **default**: `true`
- **description**: Use prettier to beautify content or not.

### 🪒 prettierCDN

- **type**: `String`
- **default**: [standalone@2.4.0](https://cdn.jsdelivr.net/npm/prettier@2.4.0/standalone.js)
- **description**:

### 🪒 prettierMDCDN

- **type**: `String`
- **default**: [parser-markdown@2.4.0](https://cdn.jsdelivr.net/npm/prettier@2.4.0/parser-markdown.js)
- **description**:

### ✂️ Cropper

- **type**：`Object`
- **default**：`undefined`
- **description**: Instance of Cropper.

### ✂️ cropperCss

- **type**: `String`
- **default**: [cropper.min.css@1.5.12](https://cdn.jsdelivr.net/npm/cropperjs@1.5.12/dist/cropper.min.css)
- **description**: Cropper css url.

### ✂️ cropperJs

- **type**: `String`
- **default**: [cropper.min.js@1.5.12](https://cdn.jsdelivr.net/npm/cropperjs@1.5.12/dist/cropper.min.js)
- **description**: Cropper js url.

### 👻 iconfontJs

- **type**: `String`
- **default**: [iconfont](https://at.alicdn.com/t/font_2605852_khjf435c7th.js)
- **description**: Icon url.

### 🎲 editorId

- **type**: `String`
- **default**: `'md-editor-rt'`
- **description**: Editor id, also the html id, it is used when there are two or more editor and server render.

### 🤏 tabWidth

- **type**: `Number`
- **default**: `2`
- **description**: One tab eq some space.

### 🔢 showCodeRowNumber

- **type**: `Boolean`
- **default**: `false`
- **description**: Show row number for code block or not.

### 🖥 screenfull

- **type**: `Object`
- **default**: `null`
- **description**: Screenfull instance, editor will not insert script of it.

### 🖥 screenfullJs

- **type**: `String`
- **default**: [5.1.0](https://cdn.jsdelivr.net/npm/screenfull@5.1.0/dist/screenfull.js)
- **description**: Screenfull js url.

### 🔦 previewTheme

- **type**: `'default' | 'github' | 'vuepress'`
- **default**: `'default'`
- **description**: Preview themes.

### 🎅🏻 style

- **type**: `CSSProperties`
- **default**: `''`
- **version**: `>= 1.2.0`
- **description**: Editor's inline style.

### 📅 tableShape

- **type**: `[Number, Number]`
- **default**: `[6, 4]`
- **version**: `>= 1.3.0`
- **description**: Preset the size of the table, [columns, rows].

```js
<Editor tableShape={[8, 4]}>
```

![Preview](/md-editor-rt/imgs/20211216165424.png)

### 📉 mermaid

- **type**: `mermaid`
- **default**: `undefined`
- **version**: `>= 1.3.0`
- **description**: Instance of `mermaid`, if you provide it, editor in browser will not download `mermaid`.

```js
import mermaid from 'mermaid'

//
<Editor mermaid={mermaid}>
```

### 📉 mermaidJs

- **type**: `String`
- **default**: [mermaid@8.13.5](https://cdn.jsdelivr.net/npm/mermaid@8.13.5/dist/mermaid.min.js)
- **version**: `>= 1.3.0`
- **description**: MermaidJs url。

```js
<Editor mermaidJs="/lib/mermaid.min.js" />
```

### ☝️ noMermaid

- **type**: `Boolean`
- **default**: `false`
- **version**: `>= 1.3.0`
- **description**: do not want to use `mermaid`, set it to `true`.

```js
<Editor noMermaid />
```

### 🪧 placeholder

- **type**: `String`
- **default**: `''`
- **version**: `>= 1.3.0`
- **description**: em-\_-！

> !!! Plug-in units are import from `cdn.jsdelivr.net`, if your project does not run on line, please use your local url to replace. eg: highlightJs = "//127.0.0.1/highlight.min.js".

### 📐 katex

- **type**: `katex`
- **default**: `undefined`
- **version**: `>= 1.9.0`
- **description**: Instance of `katex`, if you provide it, editor in browser will not download `katex`.

```js
import katex from 'katex'

//
<Editor katex={katex}>
```

### 📐 katexJs

- **type**: `String`
- **default**: [katex.min.js@0.15.1](https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.js)
- **version**: `>= 1.9.0`
- **description**: katexJs url.

```js
<Editor katexJs="/lib/katex.min.js" />
```

### 📐 katexCss

- **type**: `String`
- **default**: [katex.min.css@0.15.1](https://cdn.jsdelivr.net/npm/katex@0.15.1/dist/katex.min.css)
- **version**: `>= 1.9.0`
- **description**: katexCss url.

```js
<Editor katexCss="/lib/katex.min.css" />
```

### ☝️ noKatex

- **type**: `Boolean`
- **default**: `false`
- **version**: `>= 1.9.0`
- **description**: Do not want to use `katex`, set it to `true`.

### 💪 defToolbars

- **type**: `Array<VNode>`
- **default**: `[]`
- **version**: `>= 1.10.0`
- **description**: Customize Toolbar, and there are two types to choose from. `NormalToolbar` and `DropdownToolbar`. To display them, put index of `defToolbars` into `toolbars`(this is not standard).

**Editor.NormalToolbar** Props

- **title**: `String`, hover tips.
- **trigger**: `VNode`, trigger dom, it will be displayed in the toolbar area also, it is usually an icon.
- **onClick**: `(e: MouseEvent) => void`, trigger click event.

**Editor.DropdownToolbar** Props

- **title**: `String`, hover tips.
- **visible**: `Boolean`, visible of dropdown.
- **onChange**: `(visible: boolean) => void`, visible changed event.
- **trigger**: `VNode`, trigger dom, it will be displayed in the toolbar area also, it is usually an icon.
- **overlay**: `VNode`, content of dropdown.

<br>
<hr>

- NormalToolbar

For a complete example, please refer to [mark example](https://imzbf.github.io/md-editor-rt/demo#💪%20Customize%20Toolbar).

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';

export default () => {
  const [md, setMd] = useState('');

  const markHandler = () => {
    const textarea = document.querySelector('#md-prev-textarea') as HTMLTextAreaElement;
    const selection = window.getSelection()?.toString();
    const endPoint = textarea.selectionStart;

    const markStr = `@${selection}@`;

    const prefixStr = textarea.value.substring(0, endPoint);
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    setMd(`${prefixStr}${markStr}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, markStr.length + endPoint);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          modelValue={md}
          editorId="md-prev"
          defToolbars={[
            <Editor.NormalToolbar
              title="mark"
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-mark"></use>
                </svg>
              }
              onClick={markHandler}
              key="mark-toolbar"
            ></Editor.NormalToolbar>
          ]}
          toolbars={['bold', 'underline', 'italic', 0]}
          onChange={(value: string) => setMd(value)}
        />
      </div>
    </div>
  );
};
```

![NormalToolbar](/md-editor-rt/imgs/normal-toolbar.gif)

<br>

- DropdownToolbar

For a complete example, please refer to [emoji example](https://imzbf.github.io/md-editor-rt/demo#💪%20Customize%20Toolbar).

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import { emojis } from '../../data';

export default () => {
  const [md, setMd] = useState('');

  const [emojiVisible, setEmojiVisible] = useState(false);

  const emojiHandler = (emoji: string) => {
    const textarea = document.querySelector('#md-prev-textarea') as HTMLTextAreaElement;
    const selection = window.getSelection()?.toString();
    const endPoint = textarea.selectionStart;

    const prefixStr = textarea.value.substring(0, endPoint);
    const suffixStr = textarea.value.substring(endPoint + (selection?.length || 0));

    setMd(`${prefixStr}${emoji}${suffixStr}`);

    setTimeout(() => {
      textarea.setSelectionRange(endPoint, endPoint + 1);
      textarea.focus();
    }, 0);
  };

  return (
    <div className="project-preview">
      <div className="container">
        <Editor
          modelValue={md}
          editorId="md-prev"
          defToolbars={[
            <Editor.DropdownToolbar
              title="emoji"
              visible={emojiVisible}
              onChange={setEmojiVisible}
              overlay={
                <>
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
                </>
              }
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-emoji"></use>
                </svg>
              }
              key="emoji-toolbar"
            ></Editor.DropdownToolbar>
          ]}
          toolbars={['bold', 'underline', 'italic', 0]}
          onChange={(value: string) => setMd(value)}
        />
      </div>
    </div>
  );
};
```

![DropdownToolbar](/md-editor-rt/imgs/dropdown-toolbar.gif)

### 🪡 extensions

- **type**: `Array<Object>`
- **default**: `[]`
- **description**: [marked](https://marked.js.org/using_pro#extensions) extensions.

`mark` example, for a complete example, please refer to [marked extensions](https://marked.js.org/using_pro#extensions).

```js
const MarkExtension = {
  name: 'MarkExtension',
  level: 'inline',
  start: (text: string) => text.match(/@[^@]/)?.index,
  tokenizer(text: string) {
    const reg = /^@([^@]*)@/;
    const match = reg.exec(text);

    if (match) {
      const token = {
        type: 'MarkExtension',
        raw: match[0],
        text: match[1].trim(),
        tokens: []
      };

      return token;
    }
  },
  renderer(token: any) {
    return `<mark>${token.text}</mark>`;
  }
};

export default () => <Editor extensions={MarkExtension} />;
```

This is an example of converting `@hello@` to `<mark>hello</mark>`.

<br>
<hr>

## 🪢 Event

### 📞 onChange

- **type**: `(v: string) => void`
- **description**: Content changed event(bind to `oninput` of `textarea`).

### 💾 onSave

- **type**: `(v: string) => void`
- **description**: Save Content event,`ctrl+s`and click button will trigger.

### 📸 onUploadImg

- **type**: `(files: Array<File>, callback: function) => void`
- **description**: Upload picture event,when picture is uploading the modal will not close,please provide right urls to the callback function.

```js
async onUploadImg(files: Array<File>, callback: (urls: string[]) => void) {
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

  callback(res.map((item: any) => item.data.url));
}
```

### ☎️ onHtmlChanged

- **type**: `(h: string) => void`
- **description**: Compile markdown successful event,you can use it to get the html code.

### 🗒 onGetCatalog

- **type**: `(list: HeadList[]) => void`
- **description**: Get catalogue of article.

### 🪄 markedHeading

- **type**: `(text: string,level: 1-6,raw: string, slugger: Slugger) => string`
- **description**: `marked` head renderer method.

> If `markedHeading` is overridden, be sure to tell the editor the algorithm for generating the title ID by `marketheadingid`.

### 🎈 markedHeadingId

- **type**: `(text: string, level: number) => string`
- **description**: Title `ID` generator.

### 🔒 sanitize

- **type**: `(html: string) => string`
- **description**: Sanitize the html, prevent XSS. When you can be sure that your content is OK, ignore this.

> Use `sanitize-html`

```js
import sanitizeHtml from 'sanitize-html';

//
<Editor sanitize={(html) => sanitizeHtml(html)} />;
```

### 🖼 markedImage

- **type**: `(href: string, title: string, desc: string) => string`
- **description**: Overrides the html element structure of the default generated picture.

Default way:

```js
(href: string, _: string, desc: string) => {
  return `<figure><img src="${href}" alt="${desc}"><figcaption>${desc}</figcaption></figure>`;
};
```

usage:

```js
const markedImage = (href: string, _: string, desc: string) => {
  return `<img src="${href}" alt="${desc}">`;
};

export default () => {
  const [state] = useState({
    text: '# head'
  });

  return <Editor modelValue={state.text} markedImage={markedImage} />;
};
```

## 🪡 Shortcut key

| key | function | description |
| --- | --- | --- |
| TAB | insert space | Insert space, the length eq `tabWidth`, default: 2, support multiline |
| SHIFT + TAB | delete space, setting is the same as Tab |  |
| CTRL + C | copy | When selected, copy the selected content. When not selected, copy the content of the current line |
| CTRL + X | shear | When selected, cut the selected content. When not selected, cut the current line |
| CTRL + D | delete | When selected, delete the selected content. When not selected, delete the current line |
| CTRL + S | save | Trigger `onSave` event |
| CTRL + B | bold text | `**bold**` |
| CTRL + U | underline | `<u>underline</u>` |
| CTRL + I | italic | `*italic*` |
| CTRL + 1-6 | h1-h6 | `# title` |
| CTRL + ↑ | superscript | `<sup>superscript</sup>` |
| CTRL + ↓ | subscript | `<sub>subscript</sub>` |
| CTRL + Q | quote | `> quote` |
| CTRL + O | ordered list | `1. ordered list` |
| CTRL + L | link | `[link](https://github.com/imzbf/md-editor-rt)` |
| CTRL + Z | withdraw | Withdraw history in editor, not the function of system |
| CTRL + SHIFT + S | line-through | `~line-through~` |
| CTRL + SHIFT + U | unordered list | `- unordered list` |
| CTRL + SHIFT + C | code block |  |
| CTRL + SHIFT + I | picture | `![picture](https://imzbf.cc)` |
| CTRL + SHIFT + Z | forward | Forward history in editor, not the function of system |
| CTRL + SHIFT + F | Beautify |  |
| CTRL + ALT + C | code row |  |
| CTRL + SHIFT + ALT + T | table | `\|table\|` |

## 🪤 Internal components

Before 1.x, they are used as attributes of the editor component, eg: `Editor.DropdownToolbar`. For more examples, refer to [document](https://imzbf.github.io/md-editor-v3).

### 🐣 NormalToolbar

`Editor.NormalToolbar`

- `title`: `string`, not necessary, the tips when hover toolbar;
- `trigger`: `string | JSX.Element`, necessary, it is usually an icon, which is displayed on the toolbar;
- `onClick`: `(e: MouseEvent) => void`, necessary.

usage:

```js
<Editor
  editorId="md-prev"
  defToolbars={[
    <Editor.NormalToolbar
      title="mark"
      trigger={
        <svg className="md-icon" aria-hidden="true">
          <use xlinkHref="#icon-mark"></use>
        </svg>
      }
      onClick={consol.log}
      key="mark-toolbar"
    ></Editor.NormalToolbar>
  ]}
/>
```

> Get the complete example of toolbar, please refer to [emoji](https://imzbf.github.io/md-editor-rt/demo#%F0%9F%92%AA%20Customize%20Toolbar), or clone source code from `dev-docs` branch.

### 🐼 DropdownToolbar

`Editor.DropdownToolbar`

- `title`: `string`, not necessary, the tips when hover toolbar;
- `visible`: `boolean`, necessary;
- `trigger`: `string | JSX.Element`, necessary, it is usually an icon, which is displayed on the toolbar;
- `onChange`: `(visible: boolean) => void`, necessary;
- `overlay`: `string | JSX.Element`, necessary, contents in the drop-down box.

usage:

```js
<Editor
  modelValue={md}
  editorId="md-prev"
  defToolbars={[
    <Editor.DropdownToolbar
      visible={emojiVisible}
      onChange={setEmojiVisible}
      overlay={
        <>
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
        </>
      }
      trigger={
        <svg className="md-icon" aria-hidden="true">
          <use xlinkHref="#icon-emoji"></use>
        </svg>
      }
      key="emoji-toolbar"
    ></Editor.DropdownToolbar>
  ]}
/>
```

### 🐻 Catalogue

`Editor.Catalog`

- `editorId`: `string`, necessary, editor's `editorId`, used to register listening events;
- `class`: `string`, not necessary;
- `markedHeadingId`: `MarkedHeadingId`, not necessary, same as editor;
- `scrollElement`: `string | HTMLElement`, not necessary, it is an element selector when its type is string. When `previewOnly` eq `true`, it is usually set to `document.documentElement`.
- `theme`: 'light' | 'dark', not necessary, provide it when you want to change theme online, it is the same as Editor `theme`.

usage:

```js
const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# head',
    theme: 'dark',
    scrollElement: document.documentElement
  });

  return (
    <>
      <Editor
        modelValue={state.text}
        editorId={editorId}
        theme={state.theme}
        previewOnly
      />
      <Editor.Catalog
        editorId={editorId}
        theme={state.theme}
        scrollElement={state.scrollElement}
      />
    </>
  );
};
```

## ✍️ Edit this page

[doc-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/doc-en-US.md)
