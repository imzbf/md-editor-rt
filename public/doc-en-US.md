> Use it online: [Go](https://codesandbox.io/s/elated-khorana-65jmr)

## 🤯 Props

### 📃 modelValue

- **type**: `string`
- **default**: `''`

  Markdown content.

  ```jsx
  <MdEditor v-model="xxx" />
  ```

### 🛍 theme

- **type**: `'light' | 'dark'`
- **default**: `'light'`

  Editor theme.

  ```jsx
  <MdEditor theme="dark" />
  ```

### 🎀 className

- **type**: `string`
- **default**: `''`

  Editor `className`.

### 🤏🏼 historyLength

- **type**: `number`
- **default**: `10`

  The max length of history(if it is too big, editor will use more `RAM`).

### 💻 pageFullScreen

- **type**: `boolean`
- **default**: `false`

  Screenfull in web page.

### 📱 preview

- **type**: `boolean`
- **default**: `true`

  Preview content in editor.

### 📀 htmlPreview

- **type**: `boolean`
- **default**: `false`

  Preview html in editor.

### 📺 previewOnly

- **type**: `boolean`
- **default**: `false`

  Only render article content, no toolbar, no edit area.

### 🔤 language

- **type**: `string`
- **default**: `'zh-CN'`

  Build-in language('zh-CN', 'en-US').

### 🧱 toolbars

- **type**: `Array`
- **default**: `[all]`

  Show contents of toolbar.

  You can sort the toolbar as you like, split tools by `'-'`, the left and right toolbars are divided by `'='`！

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

  Don't show some item of toolbars, all keys.

### 🪒 noPrettier

- **type**: `boolean`
- **default**: `true`

  Use prettier to beautify content or not.

### 🎲 editorId

- **type**: `string`
- **default**: `'md-editor-rt'`

  Editor id, also the html id, it is used when there are two or more editor and server render.

### 🤏 tabWidth

- **type**: `number`
- **default**: `2`

  One tab eq some space.

### 🔢 showCodeRowNumber

- **type**: `boolean`
- **default**: `false`

  Show row number for code block or not.

### 🔦 previewTheme

- **type**: `'default' | 'github' | 'vuepress' | 'mk-cute' | 'smart-blue' | 'cyanosis'`
- **default**: `'default'`

  Preview themes.

  Custom:

  1. Write css

  ```css
  .xxx-theme {
    color: red;
  }
  ```

  2. Set `previewTheme`

  ```jsx
  <MdEditor previewTheme="xxx" />
  ```

  For more, refer to [markdown-theme](https://github.com/imzbf/markdown-theme).

### 🎅🏻 style

- **type**: `CSSProperties`
- **default**: `{}`

  Editor inline style.

### 📅 tableShape

- **type**: `[number, number]`
- **default**: `[6, 4]`

  Preset the size of the table, [columns, rows].

  ```jsx
  <MdEditor tableShape={[8, 4]}>
  ```

  ![Preview](https://imzbf.github.io/md-editor-rt/imgs/20211216165424.png)

### ☝️ noMermaid

- **type**: `boolean`
- **default**: `false`

  do not want to use `mermaid`, set it to `true`.

  ```jsx
  <MdEditor noMermaid />
  ```

### 🪧 placeholder

- **type**: `string`
- **default**: `''`

  em-\_-！

### ❌ noKatex

- **type**: `boolean`
- **default**: `false`

  Do not want to use `katex`, set it to `true`.

### 💪 defToolbars

- **type**: `Array<VNode>`
- **default**: `[]`

  Custom toolbar in `DropdownToolbar`, `NormalToolbar` or `ModalToolbar`. To display them, put index of `defToolbars` into `toolbars`(this is not standard).

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
        toolbars=['github', '=', 0]
        defToolbars={[
          <NormalToolbar
            title="mark"
            onClick={handler}
            trigger={
              <svg className="md-icon" aria-hidden="true">
                <use xlinkHref="#icon-mark"></use>
              </svg>
            }
          />
        ]}
      />
    );
  };
  ```

  ![NormalToolbar](https://imzbf.github.io/md-editor-rt/imgs/normal-toolbar.gif)

  ![DropdownToolbar](https://imzbf.github.io/md-editor-rt/imgs/dropdown-toolbar.gif)

  For more info, Get **Internal Components** heading. Get source code of **mark**, **emoji** and **modal preview** at [docs](https://github.com/imzbf/md-editor-rt/tree/docs/src/components) branch.

### 🦉 codeTheme

- **type**: `'atom'|'a11y'|'github'|'gradient'|'kimbie'|'paraiso'|'qtcreator'|'stackoverflow'`
- **default**: `'atom'`

  Highlight code css name. Get Them from `highlight.js`.

  Custom:

  1. Config `editorExtensions`

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

  2. Set `codeTheme`

  ```jsx
  <MdEditor codeTheme="xxx" />
  ```

### 🎱 markedHeadingId

- **type**: `(text: string, level: number, index: number) => string`
- **default**: `(text) => text`

  Title `ID` generator.

  1. Config `markedRenderer`

  ```jsx
  import MdEditor from 'md-editor-rt';

  const generateId = (_text, _level, index) => `heading-${index}`;

  MdEditor.config({
    markedRenderer(renderer) {
      renderer.heading = (text, level, _r, _s, index) => {
        const id = generateId(text, level, index);
        return `<h${level} id="${id}">${text}</h${level}>`;
      };
      return renderer;
    }
  });

  export default () => {
    return <MdEditor markedHeadingId={generateId} />;
  };
  ```

  2. Set `markedHeadingId`

  ```jsx
  <MdEditor markedHeadingId={generateId} />
  ```

### 🐣 sanitize

- **type**: `(html: string) => string`
- **default**: `(html) => html`

  Sanitize the html, prevent XSS. When you can be sure that your content is OK, ignore this.

  `sanitize-html` example:

  ```js
  import sanitizeHtml from 'sanitize-html';

  const sanitize = (html) => sanitizeHtml(html);
  ```

  ```jsx
  <MdEditor sanitize={sanitize} />
  ```

### 🦶 footers

- **type**: `Array<'markdownTotal' \| '=' \| 'scrollSwitch' \| number>`
- **default**: `['markdownTotal', '=', 'scrollSwitch']`

  Show contents of footer, they are divided by `'='`. Set it to [] to hidden footer.

### ⛵️ scrollAuto

- **type**: `boolean`
- **default**: `true`

  Scroll default setting.

### 🦿 defFooters

- **type**: `Array<string \| ReactElement>`
- **default**: `[]`

  Custom footer.

  [Get](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx) example code.

### 🤞🏼 noIconfont

- **类型**: `boolean`
- **默认值**: `true`
- **说明**: Not append iconfont script, [download](https://at.alicdn.com/t/font_2605852_pqekijay2ij.js) and import it by yourself.

  ```jsx
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  import '/assets/iconfont.js';

  export default () => {
    return <MdEditor noIconfont />;
  };
  ```

## 🪢 Event

### 📞 onChange

- **type**: `(v: string) => void`

  Content changed event(bind to `oninput` of `textarea`).

### 💾 onSave

- **type**: `(v: string) => void`

  Save Content event, `ctrl+s` and click button will trigger.

### 📸 onUploadImg

- **type**: `(files: Array<File>, callback: (urls: Array<string>) => void) => void`

  Upload picture event, when picture is uploading the modal will not close, please provide right urls to the callback function.

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

- **type**: `(h: string) => void`

  Compile markdown successful event, you can use it to get the html code.

### 🗒 onGetCatalog

- **type**: `(list: HeadList[]) => void`

  Get catalogue of article.

### 💀 onError

- **type**: `(err: { name: string; message: string;}) => void`

  Run-Time error event, only be called when `Cropper`, `fullScreen`, `prettier` is not loaded.

  ```js
  const onError = (err) => {
    alert(err.message);
  };
  ```

  ```jsx
  <MdEditor onError={onError} />
  ```

## 💴 Config Editor

Custom `marked renderer` in `MdEditor.config(option: ConfigOption)`.

- markedRenderer: `(renderer: RewriteRenderer) => RewriteRenderer`

  Open target page in a new browser window:

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

  Set heading ID to `heading-${index}`:

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

  > Reference: https://marked.js.org/using_pro#renderer, RewriteRenderer extends Renderer and rewrites heading, now provides index as the fifth parameter.

- markedExtensions: `Array<marked.TokenizerExtension & marked.RendererExtension>`

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedExtensions: [your extension]
  });
  ```

  > Reference: https://marked.js.org/using_pro#extensions

  [Docs page source code](https://github.com/imzbf/md-editor-rt/blob/docs/src/main.ts)

- markedOptions: `marked.MarkedOptions`

  Do not render `<br>` on a single line break:

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    markedOptions: { breaks: false }
  });
  ```

  > Reference: https://marked.js.org/using_advanced#options

- editorConfig: Add more languages, reset `mermaid` template or delay rendering time

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    editorConfig: {
      languageUserDefined: {
        'en-US': {
          toolbarTips: {
            bold: 'bold',
            underline: 'underline',
            italic: 'italic',
            strikeThrough: 'strikeThrough',
            title: 'title',
            sub: 'subscript',
            sup: 'superscript',
            quote: 'quote',
            unorderedList: 'unordered list',
            orderedList: 'ordered list',
            codeRow: 'inline code',
            code: 'block-level code',
            link: 'link',
            image: 'image',
            table: 'table',
            mermaid: 'mermaid',
            katex: 'formula',
            revoke: 'revoke',
            next: 'undo revoke',
            save: 'save',
            prettier: 'prettier',
            pageFullscreen: 'fullscreen in page',
            fullscreen: 'fullscreen',
            preview: 'preview',
            htmlPreview: 'html preview',
            catalog: 'catalog',
            github: 'source code'
          },
          titleItem: {
            h1: 'Lv1 Heading',
            h2: 'Lv2 Heading',
            h3: 'Lv3 Heading',
            h4: 'Lv4 Heading',
            h5: 'Lv5 Heading',
            h6: 'Lv6 Heading'
          },
          imgTitleItem: {
            link: 'Add Img Link',
            upload: 'Upload Img',
            clip2upload: 'Clip Upload'
          },
          linkModalTips: {
            title: 'Add ',
            descLable: 'Desc:',
            descLablePlaceHolder: 'Enter a description...',
            urlLable: 'Link:',
            UrlLablePlaceHolder: 'Enter a link...',
            buttonOK: 'OK'
          },
          clipModalTips: {
            title: 'Crop Image',
            buttonUpload: 'Upload'
          },
          copyCode: {
            text: 'Copy',
            successTips: 'Copied!',
            failTips: 'Copy failed!'
          },
          mermaid: {
            flow: 'flow',
            sequence: 'sequence',
            gantt: 'gantt',
            class: 'class',
            state: 'state',
            pie: 'pie',
            relationship: 'relationship',
            journey: 'journey'
          },
          katex: {
            inline: 'inline',
            block: 'block'
          },
          footer: {
            markdownTotal: 'Word Count',
            scrollAuto: 'Scroll Auto'
          }
        },
        // mermaid template
        mermaidTemplate: {
          flow: `flow tempalte`,
          sequence: `sequence template`,
          gantt: `gantt template`,
          class: `class template`,
          state: `state template`,
          pie: `pie template`,
          relationship: `relationship template`,
          journey: `journey template`
        },
        // delay rendering time(ms)
        renderDelay: 0
      }
    }
  });
  ```

- editorExtensions: Config some dependency libraries, like highlight..

  ```typescript
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

They are used as attributes of the editor component, eg: `Editor.DropdownToolbar`

### 🐣 NormalToolbar

`Editor.NormalToolbar`

- **props**

  - `title`: `string`, not necessary, title of toolbar.

- **events**

  - `onClick`: `(e: MouseEvent) => void`, necessary.

- **slots**

  - `trigger`: `string | ReactElement`, necessary, it is usually an icon, which is displayed on the toolbar.

usage:

```jsx
<MdEditor
  editorId="md-prev"
  defToolbars={[
    <MdEditor.NormalToolbar
      title="mark"
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

[MarkExtension Source Code](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/MarkExtension/index.tsx)

### 🐼 DropdownToolbar

`Editor.DropdownToolbar`

- **props**

  - `title`: `string`, not necessary, title of toolbar.
  - `visible`: `boolean`, necessary.

- **events**

  - `onChange`: `(visible: boolean) => void`, necessary.

- **slots**

  - `trigger`: `string | ReactElement`, necessary, it is usually an icon, which is displayed on the toolbar.
  - `overlay`: `string | ReactElement`, necessary, content of dropdown box.

usage:

```js
<MdEditor
  modelValue={md}
  editorId="md-prev"
  defToolbars={[
    <MdEditor.DropdownToolbar
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
    />
  ]}
/>
```

### 🦉 ModalToolbar

- **props**

  - `title`: `string`, not necessary, title of toolbar.
  - `modalTitle`: `string`, not necessary, title of the Modal.
  - `visible`: `boolean`, necessary, visibility of Modal.
  - `width`: `string`, not necessary, width of Modal, default `auto`.
  - `height`: `string`, same as `width`.
  - `showAdjust`: `boolean`, not necessary, visibility of fullscreen button.
  - `isFullscreen`: `boolean`, necessary when `showAdjust = true`, status of fullscreen.

- **events**

  - `onClick`: `() => void`, necessary.
  - `onClose`: `() => void`, necessary, close event.
  - `onAdjust`: `(val: boolean) => void`, fullscreen button click event.

- **slots**

  - `trigger`: `string | ReactElement`, necessary, it is usually an icon, which is displayed on the toolbar.
  - `overlay`: `string | ReactElement`, necessary, content of Modal.

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

[ReadExtension Source Code](https://github.com/imzbf/md-editor-rt/blob/docs/src/components/ReadExtension/index.vue)

### 🐻 MdCatalog

`Editor.MdCatalog`

- **props**

  - `editorId`: `string`, necessary, editor's `editorId`, used to register listening events.
  - `className`: `string`, not necessary.
  - `markedHeadingId`: `MarkedHeadingId`, not necessary, same as editor.
  - `scrollElement`: `string | HTMLElement`, not necessary, it is an element selector when its type is string. When `previewOnly` eq `true`, it is usually set to `document.documentElement`.
  - `theme`: 'light' | 'dark', not necessary, provide it when you want to change theme online, it is the same as Editor `theme`.

- **events**

  - `onClick`: `(e: MouseEvent, t: TocItem) => void`, not necessary.

usage:

```jsx
const editorId = 'my-editor';

export default () => {
  const [state] = useState({
    text: '# heading',
    scrollElement: document.documentElement
  });

  return (
    <>
      <Editor modelValue={state.text} editorId={editorId} previewOnly />
      <Editor.Catalog editorId={editorId} scrollElement={state.scrollElement} />
    </>
  );
};
```

## ✍️ Edit this page

[doc-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/doc-en-US.md)
