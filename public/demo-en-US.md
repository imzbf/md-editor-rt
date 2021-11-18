## 😁Basic usage

It has been developing iteratively，so update the latest version please. Publish logs: [releases](https://github.com/imzbf/md-editor-v3/releases)

### 🤖Install

```shell
yarn add md-editor-v3
```

Now, we can develop vue3 project by `jsx` friendly. Editor is compatible for some enthusiasts(like me).

### 🤓Simple use

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return <Editor modelValue={text} onChange={setText} />;
}
```

## 🥂Extended

Usages of some APIs.

### 🍦Change Theme

After `v1.1.0`, Themes are divided into editor themes(api: `theme`) and article preview themes(api: `previewTheme`).

#### 🍧Editor Theme

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

#### 🍡Preview Theme

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

### 🛠Extension component

Extensions highlight, prettier, cropper, screenfull are import from `cdn`. When your project is running offline, replace urls of these extensions. Some Extensions support be injected in development environment.

Demo of `screenfull`

#### ⚰️Inject directly

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
// 引用screenfull
import screenfull from 'screenfull';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return <Editor modelValue={text} onChange={setText} screenfull={screenfull} />;
}
```

#### 📡Intranet link

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

### 📷Upload pictures

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

### 🏳️‍🌈Extension language

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

### 📄Get catalogue

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

Create `Catalog` component, source code: [Catalog](https://github.com/imzbf/md-editor-rt/tree/dev-docs/src/components/Catalog)

### 🪚Define toolbar

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

## 🧻End
