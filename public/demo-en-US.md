## 😁 Basic Usage

It has been developing iteratively, so update the latest version please. Publish logs: [releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤓 CDN

Use production version in html directly:

```html
<!doctype html>
<html lang="en">
  <head>
    <link
      href="https://unpkg.com/md-editor-rt@${EDITOR_VERSION}/lib/style.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/md-editor-rt@${EDITOR_VERSION}/lib/umd/index.js"></script>
    <script>
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(MdEditorRT.MdEditor, {
          modelValue: 'Hello Editor!!'
        })
      );
    </script>
  </body>
</html>
```

### 🤖 Npm Install

```shell [install:yarn]
yarn add md-editor-rt
```

```shell [install:npm]
npm install md-editor-rt
```

When using server-side rendering, make sure to set `editorId` to a constant value.

#### 🤓 Jsx Template

```jsx
import React, { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

#### 📖 Preview Only

```jsx
import React, { useState } from 'react';
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

export default () => {
  const [id] = useState('preview-only');
  const [scrollElement] = useState(document.documentElement);
  const [text] = useState('hello md-editor-rt！');

  return (
    <>
      <MdPreview editorId={id} modelValue={text} />
      <MdCatalog editorId={id} scrollElement={scrollElement} />
    </>
  );
};
```

When using server-side rendering, `scrollElement` should be of string type, eg: `body`, `#id`, `.class`.

## 🥂 Api usage

Usages of some APIs.

### 🥶 Customize Shortcut Key

Source code for built-in shortcut key configuration: [commands.ts](https://github.com/imzbf/md-editor-rt/blob/develop/packages/MdEditor/layouts/Content/codemirror/commands.ts). They have been added as extensions to `codemirror`.

The basic principle of replacing or deleting shortcut keys is to find the corresponding extension, and handle it.

In fact, The Second input parameter `extensions` of `codeMirrorExtensions` is an array, The first item in the array is the shortcut key extension. The third input parameter is the default shortcut key configuration.

#### 💅 Modify Shortcut Key

Change `Ctrl-b` to `Ctrl-m`

```js
import { config } from 'md-editor-rt';
import { keymap } from '@codemirror/view';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions, mdEditorCommands) {
    const newExtensions = [...extensions];
    // 1. Remove the default shortcut key extension first
    newExtensions.shift();

    // 2. Reference the source code for shortcut key configuration
    // Find the location of the configuration item for CtrlB in mdEditorCommands
    const CtrlB = mdEditorCommands[0];

    // 3. Document for configuring shortcut keys of codemirror
    // https://codemirror.net/docs/ref/#commands
    const CtrlM = {
      // We need the run method in CtrlB here
      ...CtrlB,
      key: 'Ctrl-m',
      mac: 'Cmd-m'
    };

    // 4. Add the modified shortcut key to the array
    const newMdEditorCommands = [
      CtrlM,
      ...mdEditorCommands.filter((i) => i.key !== 'Ctrl-b')
    ];

    newExtensions.push(keymap.of(newMdEditorCommands));

    return newExtensions;
  }
});
```

#### ✂️ Delete Shortcut Key

Disable all shortcut keys

```js
import { config } from 'md-editor-rt';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions) {
    const newExtensions = [...extensions];
    // 1. Remove default shortcut key extensions
    newExtensions.shift();

    // 2. Return extension list
    return newExtensions;
  }
});
```

#### 💉 Add Shortcut Key

If you want to insert content into the edit box, you need to use the `insert` method bound on the instance of editor, reference: [Insert content into the edit box](/md-editor-rt/ed-US/docs#%F0%9F%92%89%20insert).

If you are not using `config` in the component where the editor is located, you are unable to obtain instance of editor at this time. You may need to use `EventBus`.

Add shortcut key `Ctrl+m`, to insert a marking module into the editing box(`==mark==`)

`index.ts`

```js
import { config } from 'md-editor-rt';
import { keymap, KeyBinding } from '@codemirror/view';
// If you used EventBus
import bus from '@/utils/event-bus';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions, mdEditorCommands) {
    const newExtensions = [...extensions];
    // 1. Remove the default shortcut key extension first
    newExtensions.shift();

    // 2. Create a new shortcut key configuration, reference: https://codemirror.net/docs/ref/#commands
    const CtrlM: KeyBinding = {
      key: 'Ctrl-m',
      mac: 'Cmd-m',
      run: () => {
        bus.emit('insertMarkBlock');
        return true;
      }
    };

    // 4. Add a new shortcut key to the array
    const newMdEditorCommands = [...mdEditorCommands, CtrlM];

    newExtensions.push(keymap.of(newMdEditorCommands));

    return newExtensions;
  }
});
```

Next, listening 'insertMarkBlock' in the component where the editor is located

`App.tsx`

```tsx
import React, { useState, useRef, useEffect } from 'react';
import { MdEditor, ExposeParam } from 'md-editor-rt';
// If you used EventBus
import bus from '@/utils/event-bus';

const App = () => {
  const [text] = useState('## md-editor-rt\n\n');
  const mdEditorRef = useRef<ExposeParam>();

  useEffect(() => {
    bus.on('insertMarkBlock', () => {
      mdEditorRef.current?.insert((selectedText) => {
        return {
          targetValue: `==${selectedText}==`,
          select: true,
          deviationStart: 2,
          deviationEnd: -2
        };
      });
    });
  }, []);

  return <MdEditor modelValue={text} ref={mdEditorRef} />;
};
```

Attach: Simple version of `EventBus`

```ts
/* eslint-disable @typescript-eslint/ban-types */
class EventBus {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, fn: Function) {
    if (!eventName) {
      console.error('Get a wrong eventName');
      return false;
    }

    if (!(fn instanceof Function)) {
      console.error('Get a wrong callback');
      return false;
    }

    const fns = this.events.get(eventName) || [];
    fns.push(fn);
    this.events.set(eventName, fns);
  }

  emit(eventName: string, ...args: any[]) {
    this.events.get(eventName)?.forEach((fn) => {
      fn(args);
    });
  }
}

export default new EventBus();
```

### 🍦 Change Theme

Themes are divided into editor theme(`theme`), article preview theme(`previewTheme`) and code theme(`codeTheme`).

#### 🍧 Editor Theme

Support `light` and `dark` default.

```jsx
import React, { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
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
import { MdEditor } from 'md-editor-rt';
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
  import { MdEditor } from 'md-editor-rt';
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
  import { config } from 'md-editor-rt';

  config({
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
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import screenfull from 'screenfull';

config({
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
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

config({
  editorExtensions: {
    screenfull: {
      js: 'https://localhost:8090/screenfull@5.2.0/index.js'
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
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

config({
  editorConfig: {
    languageUserDefined: {
      'my-lang': {
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
          task: 'task list',
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
          linkTitle: 'Add Link',
          imageTitle: 'Add Image',
          descLabel: 'Desc:',
          descLabelPlaceHolder: 'Enter a description...',
          urlLabel: 'Link:',
          urlLabelPlaceHolder: 'Enter a link...',
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

You can install the existing language also: [md-editor-extension](https://github.com/imzbf/md-editor-extension). Refer to extension library for the usage and the way to contribute~

### 📄 Get Catalogue

- Get

  ```jsx
  import React, { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt!');
    const [catalogList, setList] = useState([]);

    return <MdEditor modelValue={text} onChange={setText} onGetCatalog={setList} />;
  };
  ```

- Display

  Use `MdCatalog`

  ```jsx
  import React, { useState } from 'react';
  import { MdPreview, MdCatalog } from 'md-editor-rt';
  import 'md-editor-rt/lib/preview.css';

  const editorId = 'my-editor';

  export default () => {
    const [state] = useState({
      text: '# heading',
      scrollElement: document.documentElement
    });

    return (
      <>
        <MdPreview modelValue={state.text} editorId={editorId} />
        <MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
      </>
    );
  };
  ```

### 🪚 Define Toolbar

> after v1.2.0, You can sort the toolbar as you like, split tools by `'-'`, the left and right toolbars are divided by `'='`!

```jsx
import React, { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <MdEditor modelValue={text} onChange={setText} toolbars={toolbars} />;
};
```

### 💪 Customize Toolbar

There are examples of `mark` and `emoji`.

To get complete code, refer to [docs](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx).

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
  --md-scrollbar-thumb-active-color: if(@isDark, #3a3a3a, #00000061);
}

.md-editor {
  .css-vars(false);
}

.md-editor-dark {
  .css-vars(true);
}
```

Change background color in dark mode:

```css
.md-editor-dark {
  --md-bk-color: #333 !important;
}
```

### 🙍🏻‍♂️ Import All Library

```jsx
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

import screenfull from 'screenfull';

import katex from 'katex';
import 'katex/dist/katex.min.css';

import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.css';

import mermaid from 'mermaid';

import highlight from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.css';

// <3.0
import prettier from 'prettier';
import parserMarkdown from 'prettier/parser-markdown';
// >=3.0
import * as prettier from 'prettier';
import parserMarkdown from 'prettier/plugins/markdown';

// https://at.alicdn.com/t/c/font_2605852_u82y61ve02.js
import './assets/iconfont.js';

config({
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
  return <MdEditor modelValue="" noIconfont />;
};
```

> Tips: While import highlight styles by yourself, editor will not be able to change code styles.

### 🔒 Compile-time Prevention of XSS

The plugin `markdown-it-xss` has already processed dangerous code during compilation, and currently supports displaying some properties of the `input ` and `iframe` tags by default:

```json
{
  // Task List
  "input": ["class", "disabled", "type", "checked"],
  // Embedded video codes such as YouTube, WeTV, and Bilibili
  "iframe": [
    "class",
    "width",
    "height",
    "src",
    "title",
    "border",
    "frameborder",
    "framespacing",
    "allow",
    "allowfullscreen"
  ]
}
```

#### 🔓 Remove XSS extension

```js
config({
  markdownItPlugins(plugins) {
    return plugins.filter((p) => p.type !== 'xss');
  }
});
```

#### 🔏 Modify XSS configuration

Add a configuration that allows for events where image loading fails

```js
config({
  markdownItPlugins(plugins) {
    return plugins.map((p) => {
      if (p.type === 'xss') {
        return {
          ...p,
          options: {
            xss(xss) {
              return {
                whiteList: Object.assign({}, xss.getDefaultWhiteList(), {
                  // If you need to use task list, please keep this configuration
                  input: ['class', 'disabled', 'type', 'checked'],
                  // If you need to use embedded video code, please keep this configuration
                  iframe: [
                    'class',
                    'width',
                    'height',
                    'src',
                    'title',
                    'border',
                    'frameborder',
                    'framespacing',
                    'allow',
                    'allowfullscreen'
                  ],
                  img: ['onerror']
                })
              };
            }
          }
        };
      }

      return p;
    });
  }
});
```

More configuration references: [js-xss](https://github.com/leizongmin/js-xss/tree/master)

### 🔒 Prevent XSS after compilation

Using `sanitize` to sanitize `html`. eg: `sanitize-html`

```shell
yarn add sanitize-html
```

```jsx
import React from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

export default () => {
  return <MdEditor sanitize={(html) => sanitizeHtml(html)} />;
};
```

## 🧻 Edit This Page

[demo-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-en-US.md)
