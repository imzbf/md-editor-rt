## 😁 Basic Usage

It has been developing iteratively, so update the latest version please. Publish logs: [releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤖 Npm Install

```shell
yarn add md-editor-rt
```

### 🤓 Jsx Template

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

## 🥂 Api usage

Usages of some APIs.

### 🍦 Change Theme

Themes are divided into editor theme(`theme`), article preview theme(`previewTheme`) and code theme(`codeTheme`).

#### 🍧 Editor Theme

Support `light` and `dark` default.

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [theme] = useState('dark');
  return <MdEditor modelValue={text} onChange={setText} theme={theme} />;
};
```

#### 🍡 Preview Theme

There are 6 kinds of themes: `default`, `github`, `vuepress`, `mk-cute`, `smart-blue` and `cyanosis`. It is useful When you want to show your article directly. Modify `previewTheme`.

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [previewTheme] = useState('github');
  return <MdEditor modelValue={text} onChange={setText} previewTheme={previewTheme} />;
};
```

- Custom

  1. Write `css` under the `xxx-theme` claa. `xxx` is the name of your theme, for more examples, refer to [markdown-theme](https://github.com/imzbf/markdown-theme).

  _xxx.css_

  ```css
  .xxx-theme code {
    color: red;
  }
  ```

  2. Import

  ```js
  import 'xxx.css';
  ```

  3. Set `previewTheme`

  ```jsx
  <MdEditor previewTheme="xxx" />
  ```

#### 🎄 Code Theme

There are 8 kinds of themes: `atom`, `a11y`, `github`, `gradient`, `kimbie`, `paraiso`,`qtcreator` and `stackoverflow`, they are all from [highlight.js](https://highlightjs.org/).

- Usage

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt!');
    const [codeTheme] = useState('atom');
    return <MdEditor modelValue={text} onChange={setText} codeTheme={codeTheme} />;
  };
  ```

- Custom

  1. Find or Write your favorite theme, then config them:

  ```js
  import MdEditor from 'md-editor-rt';

  MdEditor.config({
    editorExtensions: {
      highlight: {
        css: {
          xxxxx: {
            light: 'https://unpkg.com/highlight.js@11.2.0/styles/xxxxx-light.css',
            dark: 'https://unpkg.com/highlight.js@11.2.0/styles/xxxxx-dark.css'
          },
          yyyyy: {
            light: 'https://unpkg.com/highlight.js@11.2.0/styles/xxxxx-light.css',
            dark: 'https://unpkg.com/highlight.js@11.2.0/styles/xxxxx-dark.css'
          }
        }
      }
    }
  });
  ```

  If some keys in object `css` are same as Editor's, Editor's whill be replaced.

  2. Set `codeTheme`

  ```jsx
  <MdEditor codeTheme="xxxxx" />
  ```

### 🛠 Config Extensions

Extensions highlight, prettier, cropper, screenfull are import from `cdn`. When your project is running offline, replace urls of these extensions. Some Extensions support be injected in development environment.

Example for `screenfull`:

#### ⚰️ Inject Directly

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import screenfull from 'screenfull';

MdEditor.config({
  editorExtensions: {
    screenfull: {
      instance: screenfull
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

#### 📡 Intranet Link

Get files from [unpkg.com](https://unpkg.com).

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

MdEditor.config({
  editorExtensions: {
    screenfull: {
      js: 'https://localhost:8090/screenfull@6.0.1/index.js'
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

### 📷 Upload Pictures

By default, you can select multiple pictures. You can paste and upload screenshots and copy web page pictures.

> Tips: When pasting pictures, if they are GIF graphs, it does not work! Please upload it by file system.

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
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
              'Content-Type': 'multipart/form-data'
            }
          })
          .then((res) => rev(res))
          .catch((error) => rej(error));
      });
    })
  );

  callback(res.map((item) => item.data.url));
};

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} onUploadImg={onUploadImg} />;
};
```

### 🏳️‍🌈 Extension Language

```js
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

MdEditor.config({
  editorConfig: {
    languageUserDefined: {
      'my-lang': {
        toolbarTips: {
          bold: '----',
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
          failTips: 'Copy Error!'
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
      }
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [language] = useState('my-lang');

  return <MdEditor modelValue={text} onChange={setText} language={language} />;
};
```

### 🛬 Modify Heading Structure

- Demand: open link in new window.

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

const getId = (_text, _level, index) => {
  return `heading-${index}`;
};

MdEditor.config({
  markedRenderer(renderer) {
    renderer.heading = (text, level, raw, _s, index) => {
      // You can not use markedHeadingId method directly, but It's really simple.
      // If the ID you defined is not equal to `raw`(your title), be sure to tell the editor the algorithm for generating the ID by `marketheadingid`.
      // If not, the Catalog will not go right.
      const id = getId(text, level, index);

      if (text !== raw) {
        return `<h${level} id="${id}">${text}</h${level}>`;
      } else {
        return `<h${level} id="${id}"><a href="#${id}">${raw}</a></h${level}>`;
      }
    };

    return renderer;
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} markedHeadingId={getId} />;
};
```

### 📄 Get Catalogue

- Get

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt!');
    const [catalogList, setList] = useState([]);

    return <MdEditor modelValue={text} onChange={setText} onGetCatalog={setList} />;
  };
  ```

- Display

  Use `MdEditor.MdCatalog`

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  const editorId = 'my-editor';

  export default () => {
    const [state] = useState({
      text: '# heading',
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

### 🪚 Define toolbar

> after v1.2.0, You can sort the toolbar as you like, split tools by `'-'`, the left and right toolbars are divided by `'='`!

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <MdEditor modelValue={text} onChange={setText} toolbars={toolbars} />;
};
```

### 💪 Customize Toolbar

There are examples of `mark` and `emoji`.

To get complete code, refer to [docs](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.vue).

![mark and Emoji extension](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

> Get more emojis, go to [https://getemoji.com/](https://getemoji.com/).

### 🧙‍♂️ Change Styles

```less
.css-vars(@isDark) {
  --md-color: if(@isDark, #999, #222);
  --md-hover-color: if(@isDark, #bbb, #000);
  --md-bk-color: if(@isDark, #000, #fff);
  --md-bk-color-outstand: if(@isDark, #111, #f6f6f6);
  --md-bk-hover-color: if(@isDark, #1b1a1a, #f5f7fa);
  --md-border-color: if(@isDark, #2d2d2d, #e6e6e6);
  --md-border-hover-color: if(@isDark, #636262, #b9b9b9);
  --md-border-active-color: if(@isDark, #777, #999);
  --md-modal-mask: #00000073;
  --md-scrollbar-bg-color: if(@isDark, #0f0f0f, #e2e2e2);
  --md-scrollbar-thumb-color: if(@isDark, #2d2d2d, #0000004d);
  --md-scrollbar-thumb-hover-color: if(@isDark, #3a3a3a, #00000059);
  --md-scrollbar-thumb-avtive-color: if(@isDark, #3a3a3a, #00000061);
}

.md {
  .css-vars(false);
}

.md-dark {
  .css-vars(true);
}
```

Change background color in dark mode:

```css
.md-dark {
  --md-bk-color: #333 !important;
}
```

### 🙍🏻‍♂️ Import All Library

```jsx
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import screenfull from 'screenfull';

import katex from 'katex';
import 'katex/dist/katex.min.css';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import mermaid from 'mermaid';

import highlight from 'highlight.js';
import 'highlight.js/styles/tokyo-night-dark.css';

import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';

MdEditor.config({
  editorExtensions: {
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    highlight: {
      instance: highlight
    },
    screenfull: {
      instance: screenfull
    },
    katex: {
      instance: katex
    },
    cropper: {
      instance: Cropper
    },
    mermaid: {
      instance: mermaid
    }
  }
});

export default () => {
  return <MdEditor modelValue="" />;
};
```

> Tips: While import highlight styles by yourself, editor will not be able to change code styles.

## 🔒 xss

after`1.3.0`, please use `sanitize` to sanitize `html`. eg: `sanitize-html`

```shell
yarn add sanitize-html
```

```jsx
import React from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

export default () => {
  return <MdEditor sanitize={(html) => sanitizeHtml(html)} />;
};
```

## 🧻 Edit this page

[demo-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-en-US.md)
