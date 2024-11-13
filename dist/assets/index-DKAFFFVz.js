import{u as m,r as t,e as l,j as n,I as c,f as p,h as u,i as h,v as f}from"./index-CHHuzJJQ.js";const r=`## 😁 Basic Usage

It has been developing iteratively, so update the latest version please. Publish logs: [releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤓 CDN

Use production version in html directly:

\`\`\`html
<!doctype html>
<html lang="en">
  <head>
    <link
      href="https://unpkg.com/md-editor-rt@\${EDITOR_VERSION}/lib/style.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"><\/script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"><\/script>
    <script src="https://unpkg.com/md-editor-rt@\${EDITOR_VERSION}/lib/umd/index.js"><\/script>
    <script>
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(MdEditorRT.MdEditor, {
          modelValue: 'Hello Editor!!'
        })
      );
    <\/script>
  </body>
</html>
\`\`\`

### 🤖 Npm Install

\`\`\`shell [install:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [install:npm]
npm install md-editor-rt
\`\`\`

When using server-side rendering, make sure to set \`editorId\` to a constant value.

#### 🤓 Jsx Template

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  return <MdEditor modelValue={text} onChange={setText} />;
};
\`\`\`

#### 📖 Preview Only

\`\`\`jsx
import { useState } from 'react';
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
\`\`\`

When using server-side rendering, \`scrollElement\` should be of string type, eg: \`body\`, \`#id\`, \`.class\`.

## 🎛 Used in Web Component

Complete example reference [the sample project](https://github.com/imzbf/md-editor-rt/tree/main/example/webComponent) provided in the source code.

Here are the precautions:

1. The image zoom-in view feature is ineffective; implementation needs to be done manually!!!
2. Do not use CDN to reference dependency libraries by default; refer to [[Import All Library]](https://imzbf.github.io/md-editor-rt/en-US/demo#%F0%9F%99%8D%F0%9F%8F%BB%E2%80%8D%E2%99%82%EF%B8%8F%20Import%20All%20Library)!!!
3. Only font-class type icons can be used; the default symbol type is ineffective!!!

## 🥂 Api usage

Usages of some APIs.

### 🥶 Customize Shortcut Key

Source code for built-in shortcut key configuration: [commands.ts](https://github.com/imzbf/md-editor-rt/blob/develop/packages/MdEditor/layouts/Content/codemirror/commands.ts). They have been added as extensions to \`codemirror\`.

The basic principle of replacing or deleting shortcut keys is to find the corresponding extension, and handle it.

In fact, The Second input parameter \`extensions\` of \`codeMirrorExtensions\` is an array, The first item in the array is the shortcut key extension. The third input parameter is the default shortcut key configuration.

#### 💅 Modify Shortcut Key

Change \`Ctrl-b\` to \`Ctrl-m\`

\`\`\`js
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
\`\`\`

#### ✂️ Delete Shortcut Key

Disable all shortcut keys

\`\`\`js
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
\`\`\`

#### 💉 Add Shortcut Key

If you want to insert content into the edit box, you need to use the \`insert\` method bound on the instance of editor, reference: [Insert content into the edit box](/md-editor-rt/ed-US/docs#%F0%9F%92%89%20insert).

If you are not using \`config\` in the component where the editor is located, you are unable to obtain instance of editor at this time. You may need to use \`EventBus\`.

Add shortcut key \`Ctrl+m\`, to insert a marking module into the editing box(\`==mark==\`)

\`index.ts\`

\`\`\`js
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
\`\`\`

Next, listening 'insertMarkBlock' in the component where the editor is located

\`App.tsx\`

\`\`\`tsx
import { useState, useRef, useEffect } from 'react';
import { MdEditor, ExposeParam } from 'md-editor-rt';
// If you used EventBus
import bus from '@/utils/event-bus';

const App = () => {
  const [text] = useState('## md-editor-rt\\n\\n');
  const mdEditorRef = useRef<ExposeParam>();

  useEffect(() => {
    bus.on('insertMarkBlock', () => {
      mdEditorRef.current?.insert((selectedText) => {
        return {
          targetValue: \`==\${selectedText}==\`,
          select: true,
          deviationStart: 2,
          deviationEnd: -2
        };
      });
    });
  }, []);

  return <MdEditor modelValue={text} ref={mdEditorRef} />;
};
\`\`\`

Attach: Simple version of \`EventBus\`

\`\`\`ts
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
\`\`\`

### 🍦 Change Theme

Themes are divided into editor theme(\`theme\`), article preview theme(\`previewTheme\`) and code theme(\`codeTheme\`).

#### 🍧 Editor Theme

Support \`light\` and \`dark\` default.

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [theme] = useState('dark');
  return <MdEditor modelValue={text} onChange={setText} theme={theme} />;
};
\`\`\`

#### 🍡 Preview Theme

There are 6 kinds of themes: \`default\`, \`github\`, \`vuepress\`, \`mk-cute\`, \`smart-blue\` and \`cyanosis\`. It is useful When you want to show your article directly. Modify \`previewTheme\`.

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [previewTheme] = useState('github');
  return <MdEditor modelValue={text} onChange={setText} previewTheme={previewTheme} />;
};
\`\`\`

- Custom

  1. Write \`css\` under the \`xxx-theme\` claa. \`xxx\` is the name of your theme, for more examples, refer to [markdown-theme](https://github.com/imzbf/markdown-theme).

  _xxx.css_

  \`\`\`css
  .xxx-theme code {
    color: red;
  }
  \`\`\`

  2. Import

  \`\`\`js
  import 'xxx.css';
  \`\`\`

  3. Set \`previewTheme\`

  \`\`\`jsx
  <MdEditor previewTheme="xxx" />
  \`\`\`

#### 🎄 Code Theme

There are 8 kinds of themes: \`atom\`, \`a11y\`, \`github\`, \`gradient\`, \`kimbie\`, \`paraiso\`,\`qtcreator\` and \`stackoverflow\`, they are all from [highlight.js](https://highlightjs.org/).

- Usage

  \`\`\`jsx
  import { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt!');
    const [codeTheme] = useState('atom');
    return <MdEditor modelValue={text} onChange={setText} codeTheme={codeTheme} />;
  };
  \`\`\`

- Custom

  1. Find or Write your favorite theme, then config them:

  \`\`\`js
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
  \`\`\`

  If some keys in object \`css\` are same as Editor's, Editor's whill be replaced.

  2. Set \`codeTheme\`

  \`\`\`jsx
  <MdEditor codeTheme="xxxxx" />
  \`\`\`

### 🛠 Config Extensions

Extensions highlight, prettier, cropper, screenfull are import from \`cdn\`. When your project is running offline, replace urls of these extensions. Some Extensions support be injected in development environment.

Example for \`screenfull\`:

#### ⚰️ Inject Directly

\`\`\`jsx
import { useState } from 'react';
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
\`\`\`

#### 📡 Intranet Link

Get files from [unpkg.com](https://unpkg.com).

\`\`\`jsx
import { useState } from 'react';
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
\`\`\`

### 📷 Upload Pictures

By default, you can select multiple pictures. You can paste and upload screenshots and copy web page pictures.

> Tips: When pasting pictures, if they are GIF graphs, it does not work! Please upload it by file system.

\`\`\`jsx
import { useState } from 'react';
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
\`\`\`

### 🏳️‍🌈 Extension Language

\`\`\`js
import { useState } from 'react';
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
\`\`\`

You can install the existing language also: [md-editor-extension](https://github.com/imzbf/md-editor-extension). Refer to extension library for the usage and the way to contribute~

### 📄 Get Catalogue

- Get

  \`\`\`jsx
  import { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt!');
    const [catalogList, setList] = useState([]);

    return <MdEditor modelValue={text} onChange={setText} onGetCatalog={setList} />;
  };
  \`\`\`

- Display

  Use \`MdCatalog\`

  \`\`\`jsx
  import { useState } from 'react';
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
  \`\`\`

### 🪚 Define Toolbar

> after v1.2.0, You can sort the toolbar as you like, split tools by \`'-'\`, the left and right toolbars are divided by \`'='\`!

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt!');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <MdEditor modelValue={text} onChange={setText} toolbars={toolbars} />;
};
\`\`\`

### 💪 Customize Toolbar

There are examples of \`mark\` and \`emoji\`.

To get complete code, refer to [docs](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx).

![mark and Emoji extension](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

> Get more emojis, go to [https://getemoji.com/](https://getemoji.com/).

### 🧙‍♂️ Change Styles

\`\`\`less
.css-vars(@isDark) {
  --md-color: if(@isDark, #999, #222);
  --md-hover-color: if(@isDark, #bbb, #000);
  --md-bk-color: if(@isDark, #000, #fff);
  --md-bk-color-outstand: if(@isDark, #333, #f2f2f2);
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
\`\`\`

Change background color in dark mode:

\`\`\`css
.md-editor-dark {
  --md-bk-color: #333 !important;
}
\`\`\`

### 🙍🏻‍♂️ Import All Library

1. Install Dependencies

\`\`\`shell
yarn add screenfull katex cropperjs mermaid highlight.js prettier
\`\`\`

2. Configure

!!! warning

We recommend configuring it at the project entry point, such as in \`main.js\` for projects created with Vite. Avoid calling \`config\` within components!

!!!

main.js

\`\`\`js
import { config } from 'md-editor-rt';
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

// \${iconfontSvgUrl}
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
\`\`\`

\`\`\`jsx
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  return <MdEditor modelValue="" noIconfont />;
};
\`\`\`

> Tips: While import highlight styles by yourself, editor will not be able to change code styles.

### 🔒 Compile-time Prevention of XSS

The built-in XSS extension has already handled dangerous code during compilation, and on top of the default whitelist, it includes additional tags and attributes:

\`\`\`json::close
{
  "img": ["class"],
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
\`\`\`

#### 🔓 Remove XSS extension

\`\`\`js
config({
  markdownItPlugins(plugins) {
    return plugins.filter((p) => p.type !== 'xss');
  }
});
\`\`\`

#### 🔏 Modify XSS configuration

Add a configuration that allows for events where image loading fails

\`\`\`js
import { config } from 'md-editor-rt';
// import { getDefaultWhiteList } from 'xss';

config({
  markdownItPlugins(plugins) {
    return plugins.map((p) => {
      if (p.type === 'xss') {
        return {
          ...p,
          options: {
            // Option 1: Extend All by Yourself
            // xss() {
            //   return {
            //     whiteList: Object.assign({}, getDefaultWhiteList(), {
            //       // If you need to use task list, please keep this configuration
            //       img: ['class'],
            //       input: ['class', 'disabled', 'type', 'checked'],
            //       // If you need to use embedded video code, please keep this configuration
            //       iframe: [
            //         'class',
            //         'width',
            //         'height',
            //         'src',
            //         'title',
            //         'border',
            //         'frameborder',
            //         'framespacing',
            //         'allow',
            //         'allowfullscreen'
            //       ],
            //       img: ['onerror']
            //     })
            //   };
            // }
            // Option 2: Add on Top of the Default Whitelist. ^4.15.5
            extendedWhiteList: {
              img: ['onerror']
            }
          }
        };
      }

      return p;
    });
  }
});
\`\`\`

More configuration references: [js-xss](https://github.com/leizongmin/js-xss/tree/master)

### 🔒 Prevent XSS after compilation

Using \`sanitize\` to sanitize \`html\`. eg: \`sanitize-html\`

\`\`\`shell
yarn add sanitize-html
\`\`\`

\`\`\`jsx
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

const sanitize = (html) => sanitizeHtml(html);

export default () => {
  return <MdEditor sanitize={sanitize} />;
};
\`\`\`

### 🗂 Folding Document Content

\`\`\`js
import { config } from 'md-editor-rt';
import { foldGutter } from '@codemirror/language';
import { lineNumbers } from '@codemirror/view';

config({
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers(), foldGutter()];
  }
});
\`\`\`

### 🏄🏻‍♂️ Open Links In New Window

1. Install additional extensions

\`\`\`shell
yarn add markdown-it-link-attributes
\`\`\`

2. Add extensions to the compiler

\`\`\`js
import { config } from 'md-editor-rt';
import LinkAttr from 'markdown-it-link-attributes';
// import Anchor from 'markdown-it-anchor';

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            // If markdown-it-anchor is used.
            // Anchor links at the heading should be ignored.
            return !href.startsWith('#');
          },
          attrs: {
            target: '_blank'
          }
        }
      },
      // {
      //   type: 'anchor',
      //   plugin: Anchor,
      //   options: {
      //     permalink: Anchor.permalink.headerLink(),
      //     slugify(s: string) {
      //       return s;
      //     }
      //   }
      // }
    ];
  }
});
\`\`\`

### ☑️ Toggleable status task list

\`\`\`js
import { config } from 'md-editor-rt';
config({
  markdownItPlugins(plugins, { editorId }) {
    return plugins.map((item) => {
      if (item.type === 'taskList') {
        return {
          ...item,
          options: {
            ...item.options,
            enabled: true
            // If you just want to enable this feature for a certain editor
            // enabled: editorId === 'myId'
          }
        };
      }
      return item;
    });
  }
});
\`\`\`

\`\`\`jsx
<MdEditor editorId="myId" modelValue={text} onChange={setText} />
\`\`\`

## 🧻 Edit This Page

[demo-en-US](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-en-US.md)
`,o=`## 😁 基本使用示例

目前一直在迭代开发，所以尽量安装最新版本。发布日志请前往：[releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤓 CDN 链接

通过直接链接生产版本来使用，下面是一个小例子：

\`\`\`html
<!doctype html>
<html lang="zh-CN">
  <head>
    <link
      href="https://unpkg.com/md-editor-rt@\${EDITOR_VERSION}/lib/style.css"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"><\/script>
    <script src="https://unpkg.com/react-dom@18.2.0/umd/react-dom.production.min.js"><\/script>
    <script src="https://unpkg.com/md-editor-rt@\${EDITOR_VERSION}/lib/umd/index.js"><\/script>
    <script>
      ReactDOM.createRoot(document.getElementById('root')).render(
        React.createElement(MdEditorRT.MdEditor, {
          modelValue: 'Hello Editor!!'
        })
      );
    <\/script>
  </body>
</html>
\`\`\`

### 🤖 NPM 安装

\`\`\`shell [install:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [install:npm]
npm install md-editor-rt
\`\`\`

当使用服务端渲染时，请务必设置\`editorId\`为固定值。

#### 🤓 基本使用

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} />;
};
\`\`\`

#### 📖 仅预览

\`\`\`jsx
import { useState } from 'react';
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
\`\`\`

当使用服务端渲染时，\`scrollElement\`应该是字符类型，例：\`body\`、\`#id\`、\`.class\`。

## 🎛 Web Component中使用

完整的示例参考源码中提供的[示例项目](https://github.com/imzbf/md-editor-rt/tree/main/example/webComponent)

下面是注意事项：

1. 图片放大查看功能无效，需要自行实现！！！
2. 不能默认的使用CDN引用依赖库，参考[[自行引入扩展库]](https://imzbf.github.io/md-editor-rt/zh-CN/demo#%F0%9F%99%8D%F0%9F%8F%BB%E2%80%8D%E2%99%82%EF%B8%8F%20%E8%87%AA%E8%A1%8C%E5%BC%95%E5%85%A5%E6%89%A9%E5%B1%95%E5%BA%93)！！！
3. 只能使用font-class引用的图标，默认的symbol引用无效！！！

## 🥂 扩展功能

这里包含了一些编辑器\`api\`的使用示范

### 🥶 自定义快捷键

内置的快捷键配置的源码：[commands.ts](https://github.com/imzbf/md-editor-rt/blob/develop/packages/MdEditor/layouts/Content/codemirror/commands.ts)，它们作为扩展项被添加到了\`codemirror\`。

想要替换、删除快捷键的基本原理是找到对应的扩展，然后遍历这个快捷键配置的数组，找到并处理它。

事实上，\`config\`中\`codeMirrorExtensions\`的第二入参\`extensions\`是一个数组，它的第一项就是快捷键扩展，第三入参就是默认的快捷键配置。

#### 💅 修改快捷键

将\`Ctrl-b\`修改为\`Ctrl-m\`

\`\`\`js
import { config } from 'md-editor-rt';
import { keymap } from '@codemirror/view';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions, mdEditorCommands) {
    const newExtensions = [...extensions];
    // 1. 先把默认的快捷键扩展移除
    newExtensions.shift();

    // 2. 参考快捷键配置的源码，找到CtrlB的配置项在mdEditorCommands中的位置
    const CtrlB = mdEditorCommands[0];

    // 3. 配置codemirror快捷键的文档
    // https://codemirror.net/docs/ref/#commands
    const CtrlM = {
      // 这里我们需要CtrlB默认触发执行的run方法，如果是新增快捷键等，就需要自行处理触发逻辑
      ...CtrlB,
      key: 'Ctrl-m',
      mac: 'Cmd-m'
    };

    // 4. 把修改后的快捷键放到待构建扩展的数组中
    const newMdEditorCommands = [
      CtrlM,
      ...mdEditorCommands.filter((i) => i.key !== 'Ctrl-b')
    ];

    newExtensions.push(keymap.of(newMdEditorCommands));

    return newExtensions;
  }
});
\`\`\`

#### ✂️ 删除快捷键

禁用所有快捷键

\`\`\`js
import { config } from 'md-editor-rt';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions) {
    const newExtensions = [...extensions];
    // 1. 把默认的快捷键扩展移除
    newExtensions.shift();

    // 2. 返回扩展列表即可
    return newExtensions;
  }
});
\`\`\`

#### 💉 新增快捷键

如果涉及到向编辑框插入内容，这是需要借助组件实例上绑定的\`insert\`方法，参考[手动向文本框插入内容](/md-editor-rt/zh-CN/docs#%F0%9F%92%89%20insert)。

如果不是在编辑器所在的组件中使用\`config\`，这是无法拿到编辑器组件实例，这时，你可能需要借助\`event-bus\`。

示例实现\`Ctrl+m\`向编辑框插入标记模块(\`==mark==\`)

\`index.ts\`

\`\`\`js
import { config } from 'md-editor-rt';
import { keymap, KeyBinding } from '@codemirror/view';
// 假设你使用了EventBus
import bus from '@/utils/event-bus';

config({
  // [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
  codeMirrorExtensions(theme, extensions, mdEditorCommands) {
    const newExtensions = [...extensions];
    // 1. 先把默认的快捷键扩展移除
    newExtensions.shift();

    // 2. 创建一个新的快捷键配置，参考https://codemirror.net/docs/ref/#commands
    const CtrlM: KeyBinding = {
      key: 'Ctrl-m',
      mac: 'Cmd-m',
      run: () => {
        bus.emit('insertMarkBlock');
        return true;
      }
    };

    // 4. 把新的快捷键添加到数组中
    const newMdEditorCommands = [...mdEditorCommands, CtrlM];

    newExtensions.push(keymap.of(newMdEditorCommands));

    return newExtensions;
  }
});
\`\`\`

接下来在编辑器所在组件监听\`insertMarkBlock\`这个事件

\`App.tsx\`

\`\`\`tsx
import { useState, useRef, useEffect } from 'react';
import { MdEditor, ExposeParam } from 'md-editor-rt';
// 假设你使用了EventBus
import bus from '@/utils/event-bus';

import 'md-editor-rt/lib/style.css';

const App = () => {
  const [text] = useState('## md-editor-rt\\n\\n');
  const mdEditorRef = useRef<ExposeParam>();

  useEffect(() => {
    bus.on('insertMarkBlock', () => {
      mdEditorRef.current?.insert((selectedText) => {
        return {
          targetValue: \`==\${selectedText}==\`,
          select: true,
          deviationStart: 2,
          deviationEnd: -2
        };
      });
    });
  }, []);

  return <MdEditor modelValue={text} ref={mdEditorRef} />;
};
\`\`\`

附：\`EventBus\`最简单实现

\`\`\`ts
/* eslint-disable @typescript-eslint/ban-types */
class EventBus {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(eventName: string, fn: Function) {
    if (!eventName) {
      console.error('无效的事件名称');
      return false;
    }

    if (!(fn instanceof Function)) {
      console.error('无效的回调方法');
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
\`\`\`

### 🍦 主题切换

主题分为了编辑器主题（\`theme\`，称为全局主题）、预览内容主题（\`previewTheme\`）和块级代码主题（\`codeTheme\`）。

#### 🍧 编辑器主题

支持默认和暗夜模式两种

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [theme] = useState('dark');
  return <MdEditor modelValue={text} onChange={setText} theme={theme} />;
};
\`\`\`

#### 🍡 预览主题

内置了\`default\`、\`github\`、\`vuepress\`、\`mk-cute\`、\`smart-blue\`、\`cyanosis\`6 种主题，在一些直接预览文档内容时使用。并且支持在线切换（修改\`previewTheme\`即可）和自行扩展。

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [previewTheme] = useState('github');
  return <MdEditor modelValue={text} onChange={setText} previewTheme={previewTheme} />;
};
\`\`\`

- 自定义

  1. 先以\`xxx-theme\`为类名，定义你的主题\`css\`，xxx 是主题名称，具体的内容参考[markdown-theme](https://github.com/imzbf/markdown-theme)

  _xxx.css_

  \`\`\`css
  .xxx-theme code {
    color: red;
  }
  \`\`\`

  2. 全局引入

  \`\`\`js
  import 'xxx.css';
  \`\`\`

  3. 设置\`previewTheme\`为 xxx

  \`\`\`jsx
  <MdEditor previewTheme="xxx" />
  \`\`\`

#### 🎄 代码主题

内置了\`atom\`、\`a11y\`、\`github\`、\`gradient\`、\`kimbie\`、\`paraiso\`、\`qtcreator\`、\`stackoverflow\`代码主题，均来至[highlight.js](https://highlightjs.org/)

- 使用

  \`\`\`jsx
  import { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt！');
    const [codeTheme] = useState('atom');
    return <MdEditor modelValue={text} onChange={setText} codeTheme={codeTheme} />;
  };
  \`\`\`

- 自定义

  1. 找到你喜欢的代码主题，最好支持暗夜模式

  \`\`\`js
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
  \`\`\`

  你可以通过将\`css\`的\`key\`设置为内置名称来覆盖内置的链接。

  2. 设置\`codeTheme\`

  \`\`\`jsx
  <MdEditor codeTheme="xxxxx" />
  \`\`\`

### 🛠 扩展库替换

highlight、prettier、cropper、screenfull 均使用外链引入，在无外网的时候，部分可将项目中已安装的依赖传入，也可以使用下载好的引用。

\`screenfull\` 的例子：

#### ⚰️ 内置实例

\`\`\`jsx
import { useState } from 'react';
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
// 引用screenfull
import screenfull from 'screenfull';

config({
  editorExtensions: {
    screenfull: {
      instance: screenfull
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} />;
};
\`\`\`

#### 📡 内网链接

对应的 js 文件可以去[unpkg.com](https://unpkg.com)，直接找到对应的文件下载即可。

\`\`\`jsx
import { useState } from 'react';
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
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} />;
};
\`\`\`

### 📷 图片上传

默认可以选择多张图片，支持截图粘贴板上传图片，支持复制网页图片粘贴上传。

> 注意：粘贴板上传时，如果是网页上的 gif 图，无法正确上传为 gif 格式！请保存本地后再手动上传。

\`\`\`jsx
import { useState } from 'react';
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
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} onUploadImg={onUploadImg} />;
};
\`\`\`

### 🏳️‍🌈 语言扩展与替换

\`\`\`js
import { useState } from 'react';
import { MdEditor, config } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

config({
  editorConfig: {
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
          task: '任务列表',
          codeRow: '行内代码',
          code: '块级代码',
          link: '链接',
          image: '图片',
          table: '表格',
          mermaid: 'mermaid图',
          katex: 'katex公式',
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
          linkTitle: '添加链接',
          imageTitle: '添加图片',
          descLabel: '链接描述：',
          descLabelPlaceHolder: '请输入描述...',
          urlLabel: '链接地址：',
          urlLabelPlaceHolder: '请输入链接...',
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
      }
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [language] = useState('my-lang');

  return <MdEditor modelValue={text} onChange={setText} language={language} />;
};
\`\`\`

你也可以使用现成的扩展语言：[md-editor-extension](https://github.com/imzbf/md-editor-extension)。使用及贡献方式见扩展库文档~

### 📄 目录获取与展示

- 获取

  \`\`\`jsx
  import { useState } from 'react';
  import { MdEditor } from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt！');
    const [catalogList, setList] = useState([]);

    return <MdEditor modelValue={text} onChange={setText} onGetCatalog={setList} />;
  };
  \`\`\`

- 展示

  使用内置\`MdCatalog\`组件

  \`\`\`jsx
  import { useState } from 'react';
  import { MdPreview, MdCatalog } from 'md-editor-rt';
  import 'md-editor-rt/lib/preview.css';

  const editorId = 'my-editor';

  export default () => {
    const [state] = useState({
      text: '# 标题',
      scrollElement: document.documentElement
    });

    return (
      <>
        <MdPreview modelValue={state.text} editorId={editorId} />
        <MdCatalog editorId={editorId} scrollElement={state.scrollElement} />
      </>
    );
  };
  \`\`\`

### 🪚 调整工具栏

从\`v1.2.0\`开始，支持调整工具栏内容顺序和分割符了 🤔。

\`\`\`jsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <MdEditor modelValue={text} onChange={setText} toolbars={toolbars} />;
};
\`\`\`

### 💪 自定义工具栏

这里包含了\`mark\`标记扩展普通工具栏和\`emoji\`扩展下拉工具栏的类型

可运行源码参考本文档[docs](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.tsx)。

![标记及Emoji预览](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

> 更多 emoji，[https://getemoji.com/](https://getemoji.com/)。

### 🧙‍♂️ 调整编辑器样式

2.x 使用 css 变量定义了大部分内容：

\`\`\`less
.css-vars(@isDark) {
  --md-color: if(@isDark, #999, #222);
  --md-hover-color: if(@isDark, #bbb, #000);
  --md-bk-color: if(@isDark, #000, #fff);
  --md-bk-color-outstand: if(@isDark, #333, #f2f2f2);
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
\`\`\`

只需要调整对应的 css 变量，比如调整暗夜模式下的背景：

\`\`\`css
.md-editor-dark {
  --md-bk-color: #333 !important;
}
\`\`\`

### 🙍🏻‍♂️ 自行引入扩展库

这里给出一个完全不使用外部链接，全部自行引入的示例：

1. 安装依赖

\`\`\`shell
yarn add screenfull katex cropperjs mermaid highlight.js prettier
\`\`\`

2. 配置到编辑器

!!! warning

我们建议你在项目入口配置，例如 vite 创建的项目中的 main.js。不要在组件中去调用 \`config\` ！

!!!

main.js

\`\`\`js
import { config } from 'md-editor-rt';
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
// import prettier from 'prettier';
// import parserMarkdown from 'prettier/parser-markdown';
// >=3.0
import * as prettier from 'prettier';
import parserMarkdown from 'prettier/plugins/markdown';

// 1. symbol引用
// \${iconfontSvgUrl}
import './assets/iconfont.js';
// 2. font-class引用
// \${iconfontClassUrl}
import './assets/iconfont.css';

config({
  // font-class引用
  // iconfontType: 'class',
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
\`\`\`

App.jsx

\`\`\`jsx
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  return <MdEditor modelValue="" noIconfont />;
};
\`\`\`

> 注意：highlight 的样式自行引入后，将不支持切换代码样式。

### 🔒 编译时防范 XSS

内置的XSS扩展已经在编译中处理了危险代码，在默认白名单的基础上，增加了部分标签和属性：

\`\`\`json::close
{
  "img": ["class"],
  // 支持任务列表
  "input": ["class", "disabled", "type", "checked"],
  // 主要支持youtobe、腾讯视频、哔哩哔哩等内嵌视频代码
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
\`\`\`

#### 🔓 移除 xss 扩展

\`\`\`js
config({
  markdownItPlugins(plugins) {
    return plugins.filter((p) => p.type !== 'xss');
  }
});
\`\`\`

#### 🔏 修改 xss 配置

我们添加一个允许图片加载失败的事件

\`\`\`js
import { config } from 'md-editor-rt';
// import { getDefaultWhiteList } from 'xss';

config({
  markdownItPlugins(plugins) {
    return plugins.map((p) => {
      if (p.type === 'xss') {
        return {
          ...p,
          options: {
            // 方式一：自行扩展全部
            // xss() {
            //   return {
            //     whiteList: Object.assign({}, getDefaultWhiteList(), {
            //       // 如果你需要使用任务列表，请保留这项配置
            //       img: ['class'],
            //       input: ['class', 'disabled', 'type', 'checked'],
            //       // 如果你需要使用嵌入视频代码，请保留这项配置
            //       iframe: [
            //         'class',
            //         'width',
            //         'height',
            //         'src',
            //         'title',
            //         'border',
            //         'frameborder',
            //         'framespacing',
            //         'allow',
            //         'allowfullscreen'
            //       ],
            //       img: ['onerror']
            //     })
            //   };
            // },
            // 方式二：在默认白名单的基础上新增。^4.15.5
            extendedWhiteList: {
              img: ['onerror']
            }
          }
        };
      }

      return p;
    });
  }
});
\`\`\`

更新详细配置参考 [js-xss](https://github.com/leizongmin/js-xss/blob/master/README.zh.md)

### 🔒 编译后防范 XSS

通过\`sanitize\`属性，自行处理不安全的 html 内容。例如：使用\`sanitize-html\`处理

\`\`\`shell
yarn add sanitize-html
\`\`\`

\`\`\`jsx
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
import sanitizeHtml from 'sanitize-html';

const sanitize = (html) => sanitizeHtml(html);

export default () => {
  return <MdEditor sanitize={sanitize} />;
};
\`\`\`

更详细的实现可以参考本文档的源码！

### 🗂 折叠文档内容

\`\`\`js
import { config } from 'md-editor-rt';
import { foldGutter } from '@codemirror/language';
import { lineNumbers } from '@codemirror/view';

config({
  codeMirrorExtensions(_theme, extensions) {
    return [...extensions, lineNumbers(), foldGutter()];
  }
});
\`\`\`

### 🏄🏻‍♂️ 新窗口打开链接

1. 安装额外的扩展

\`\`\`shell
yarn add markdown-it-link-attributes
\`\`\`

2. 将扩展添加到编译器中

\`\`\`js
import { config } from 'md-editor-rt';
import LinkAttr from 'markdown-it-link-attributes';
// import Anchor from 'markdown-it-anchor';

config({
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'linkAttr',
        plugin: LinkAttr,
        options: {
          matcher(href: string) {
            // 如果使用了markdown-it-anchor
            // 应该忽略标题头部的锚点链接
            return !href.startsWith('#');
          },
          attrs: {
            target: '_blank'
          }
        }
      },
      // {
      //   type: 'anchor',
      //   plugin: Anchor,
      //   options: {
      //     permalink: Anchor.permalink.headerLink(),
      //     slugify(s: string) {
      //       return s;
      //     }
      //   }
      // }
    ];
  }
});
\`\`\`

### ☑️ 可切换状态的任务列表

\`\`\`js
import { config } from 'md-editor-rt';
config({
  markdownItPlugins(plugins, { editorId }) {
    return plugins.map((item) => {
      if (item.type === 'taskList') {
        return {
          ...item,
          options: {
            ...item.options,
            enabled: true
            // 如果只是想对某个编辑器开启这个功能
            // enabled: editorId === 'myId'
          }
        };
      }
      return item;
    });
  }
});
\`\`\`

\`\`\`jsx
<MdEditor editorId="myId" modelValue={text} onChange={setText} />
\`\`\`

## 🧻 编辑此页面

[demo-zh-CN](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-zh-CN.md)
`,i="demo-preview",x=()=>{const e=m(a=>a),[s,d]=t.useState(()=>e.lang==="zh-CN"?o:r);return t.useEffect(()=>{d(l(e.lang==="en-US"?r:o,{iconfontSvgUrl:u,iconfontClassUrl:h,EDITOR_VERSION:f}))},[e.lang]),n.jsx("div",{className:"container",children:n.jsxs("div",{className:"doc",children:[n.jsx(c,{editorId:i,modelValue:s}),n.jsx(p,{editorId:i})]})})};export{x as default};
