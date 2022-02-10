## 😁 Basic usage

It has been developing iteratively，so update the latest version please. Publish logs: [releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤖 Install

```shell
yarn add md-editor-rt
```

Now, we can develop vue3 project by `jsx` friendly. Editor is compatible for some enthusiasts(like me).

### 🤓 Simple use

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return <Editor modelValue={text} onChange={setText} />;
}
```

## 🥂 Extended

Usages of some APIs.

### 🍦 Change Theme

After `v1.1.0`, Themes are divided into editor themes(api: `theme`) and article preview themes(api: `previewTheme`).

#### 🍧 Editor Theme

Support `light` and `dark` default.

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  const [theme] = useState('dark');
  return <Editor modelValue={text} onChange={setText} theme={theme} />;
}
```

#### 🍡 Preview Theme

There are three themes `default`, `github` and `vuepress`. It is useful When you want to show your article directly. Modify `previewTheme`.

Rules:

- When `previewTheme` is `default` or `vuepress`, change `theme` api, the style of code will not change;
- When `github`, the style of code will vary in `github-light` and `github-dark`.

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  const [previewTheme] = useState('github');
  return <Editor modelValue={text} onChange={setText} previewTheme={previewTheme} />;
}
```

### 🛠 Extension component

Extensions highlight, prettier, cropper, screenfull are import from `cdn`. When your project is running offline, replace urls of these extensions. Some Extensions support be injected in development environment.

Demo of `screenfull`

#### ⚰️ Inject directly

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import screenfull from 'screenfull';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return <Editor modelValue={text} onChange={setText} screenfull={screenfull} />;
}
```

#### 📡 Intranet link

Get these extension files from [https://www.jsdelivr.com/](https://www.jsdelivr.com/).

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return (
    <Editor
      modelValue={text}
      onChange={setText}
      screenfullJs="'http://127.0.0.1:90/libs/screenfull.js'"
    />
  );
}
```

### 📷 Upload pictures

By default, you can select multiple pictures. You can paste and upload screenshots and copy web page pictures.

> Only one image can be selected for image clipping ~，but `onUploadImg` function will receive an array also.

> Tips: When pasting pictures, if they are GIF graphs, it does not work! Please upload it by file system.

```js
async onUploadImg(files: FileList, callback: (urls: string[]) => void) {
  const res = await Promise.all(
    Array.from(files).map((file) => {
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

### 🏳️‍🌈 Extension language

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');

  const [language] = useState('my-lang');
  const [languageUserDefined] = useState({
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
      catalog: 'catalog',
      preview: 'preview',
      htmlPreview: 'html preview',
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
      tips: 'Copied!'
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
    }
  });

  return (
    <Editor
      modelValue={text}
      onChange={setText}
      language={language}
      languageUserDefined={languageUserDefined}
    />
  );
}
```

### 🛬 Modify head structure

Use `markedHeading` to modify head structure, after `v1.2.2`, if there are some content about `markdown`(like: link..）, editor will display them first.

> Document of `markedHeading` is the same as `heading` in [marked.js](https://marked.js.org/using_pro#renderer).

- Demand: open link in new window.

- Demo:

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

const markedHeading = (text, level, raw) => {
  // You can not use markedHeadingId method directly, but It's really simple.
  // If the ID you defined is not equal to `raw`(your title), be sure to tell the editor the algorithm for generating the ID by `marketheadingid`.
  // If not, the Catalog will not go right.
  const id = raw;

  if (/<a.*>.*<\/a>/.test(text)) {
    return `<h${level} id="${id}">${text.replace(
      /(?<=\<a.*)>(?=.*<\/a>)/,
      ' target="_blank">'
    )}</h${level}>`;
  } else if (text !== raw) {
    return `<h${level} id="${id}">${text}</h${level}>`;
  } else {
    return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
  }
};

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  const [catalogList, setList] = useState([]);

  return <Editor modelValue={text} onChange={setText} markedHeading={markedHeading} />;
}
```

### 📄 Get catalogue

Get data list by `onGetCatalog`:

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  const [catalogList, setList] = useState([]);

  return <Editor modelValue={text} onChange={setText} onGetCatalog={setList} />;
}
```

If there is a component like [`Anchor`](https://ant.design/components/anchor-cn/) in your project, continue.

#### 🚥 Generate catalogs

We need create `Catalog` component and `CatalogLink` component to finish this function.

**Catalog.tsx**

```js
import React, { ReactElement, useMemo } from 'react';
import { Anchor } from 'antd';
import './style.less';
import CatalogLink from './CatalogLink';

export interface TocItem {
  text: string;
  level: number;
  children?: Array<TocItem>;
}

const Catalog = ({ heads }: { heads: Array<any> }): ReactElement => {
  const catalogs = useMemo(() => {
    const tocItems: TocItem[] = [];

    heads.forEach(({ text, level }) => {
      const item = { level, text };

      if (tocItems.length === 0) {
        tocItems.push(item);
      } else {
        let lastItem = tocItems[tocItems.length - 1];

        if (item.level > lastItem.level) {
          for (let i = lastItem.level + 1; i <= 6; i++) {
            const { children } = lastItem;
            if (!children) {
              lastItem.children = [item];
              break;
            }

            lastItem = children[children.length - 1];

            if (item.level <= lastItem.level) {
              children.push(item);
              break;
            }
          }
        } else {
          tocItems.push(item);
        }
      }
    });

    return tocItems;
  }, [heads]);

  return (
    <Anchor affix={false} showInkInFixed={false}>
      {catalogs.map((item) => (
        <CatalogLink key={`${item.level}-${item.text}`} tocItem={item} />
      ))}
    </Anchor>
  );
};

export default Catalog;
```

**CatalogLink.tsx**

```js
import React, { ReactElement } from 'react';
import { Anchor } from 'antd';
import { TocItem } from './';

const { Link } = Anchor;

interface CatalogLinkProps {
  tocItem: TocItem;
}

const CatalogLink = ({ tocItem }: CatalogLinkProps): ReactElement => {
  return (
    <Link href={`#${tocItem.text}`} title={tocItem.text}>
      {tocItem.children && (
        <div className="catalog-container">
          {tocItem.children.map((item) => (
            <CatalogLink key={`${item.level}-${item.text}`} tocItem={item} />
          ))}
        </div>
      )}
    </Link>
  );
};

export default CatalogLink;
```

**style.css**

```css
.catalog-container {
  max-height: 300px;
  overflow: auto;
}
```

Source code: [Catalog](https://github.com/imzbf/md-editor-rt/tree/dev-docs/src/components/Catalog).

### 🪚 Define toolbar

> after v1.2.0, You can sort the toolbar as you like, split tools by `'-'`, the left and right toolbars are divided by `'='`！

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <Editor modelValue={text} onChange={setText} toolbars={toolbars} />;
}
```

### 💪 Customize Toolbar

There are examples of `mark` and `emoji`.

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import { emojis } from '../../data';
import MarkExtension from '@/utils/marked-mark';
import './index.less';

export default () => {
  const [md, setMd] = useState('');

  const [emojiVisible, setEmojiVisible] = useState(false);

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
            <Editor.NormalToolbar
              title="mark"
              trigger={
                <svg className="md-icon" aria-hidden="true">
                  <use xlinkHref="#icon-mark"></use>
                </svg>
              }
              onClick={markHandler}
              key="mark-toolbar"
            ></Editor.NormalToolbar>,
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
          extensions={[MarkExtension]}
          toolbars={[
            'bold',
            'underline',
            'italic',
            'strikeThrough',
            '-',
            'title',
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
            0,
            1,
            '-',
            'revoke',
            'next',
            'save',
            '=',
            'prettier',
            'pageFullscreen',
            'fullscreen',
            'preview',
            'htmlPreview',
            'catalog',
            'github'
          ]}
          onChange={(value: string) => setMd(value)}
        />
      </div>
    </div>
  );
};
```

**data.ts**

```js
export const emojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '🥲',
  '🤔',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😛',
  '😝',
  '😜',
  '🤪',
  '🤨',
  '🧐',
  '🤓',
  '😎',
  '🥸',
  '🤩',
  '🥳',
  '😏',
  '😒',
  '😞',
  '😔',
  '😟',
  '😕',
  '🙁',
  '👻',
  '😣',
  '😖',
  '😫',
  '😩',
  '🥺',
  '😢',
  '😭',
  '😤',
  '😠',
  '😡',
  '🤬',
  '🤯',
  '😳'
];
```

> Get more emojis, go to [https://getemoji.com/](https://getemoji.com/).

To get complete code, refer to [Preview.tsx](https://github.com/imzbf/md-editor-rt/blob/dev-docs/src/pages/Preview/index.tsx).

![mark and Emoji extension](/md-editor-rt/imgs/mark_emoji.gif)

### 🪡 marked extension

Simple example of converting `@hello@` to `<mark>hello</mark>`.

```js
export default {
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
```

## 🔒 xss

after`1.3.0`, please use `sanitize` to sanitize `html`. eg: `sanitize-html`

```js
// install
yarn add sanitize-html

// use
import sanitizeHtml from 'sanitize-html';

//
<Editor sanitize={(html) => sanitizeHtml(html)} />;
```

## 🧻 Edit this page

[demo-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-en-US.md)
