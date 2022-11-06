## 😁 基本使用示例

目前一直在迭代开发，所以尽量安装最新版本。发布日志请前往：[releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤖 NPM 安装

```shell
yarn add md-editor-rt
```

### 🤓 基本使用

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

## 🥂 扩展功能

这里包含了一些编辑器`api`的使用示范

### 🍦 主题切换

主题分为了编辑器主题（`theme`，称为全局主题）、预览内容主题（`previewTheme`）和块级代码主题（`codeTheme`）。

#### 🍧 编辑器主题

支持默认和暗夜模式两种

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [theme] = useState('dark');
  return <MdEditor modelValue={text} onChange={setText} theme={theme} />;
};
```

#### 🍡 预览主题

内置了`default`、`github`、`vuepress`、`mk-cute`、`smart-blue`、`cyanosis`6 种主题，在一些直接预览文档内容时使用。并且支持在线切换（修改`previewTheme`即可）和自行扩展。

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [previewTheme] = useState('github');
  return <MdEditor modelValue={text} onChange={setText} previewTheme={previewTheme} />;
};
```

- 自定义

  1. 先以`xxx-theme`为类名，定义你的主题`css`，xxx 是主题名称，具体的内容参考[markdown-theme](https://github.com/imzbf/markdown-theme)

  _xxx.css_

  ```css
  .xxx-theme code {
    color: red;
  }
  ```

  2. 全局引入

  ```js
  import 'xxx.css';
  ```

  3. 设置`previewTheme`为 xxx

  ```jsx
  <MdEditor previewTheme="xxx" />
  ```

#### 🎄 代码主题

内置了`atom`、`a11y`、`github`、`gradient`、`kimbie`、`paraiso`、`qtcreator`、`stackoverflow`代码主题，均来至[highlight.js](https://highlightjs.org/)

- 使用

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt！');
    const [codeTheme] = useState('atom');
    return <MdEditor modelValue={text} onChange={setText} codeTheme={codeTheme} />;
  };
  ```

- 自定义

  1. 找到你喜欢的代码主题，最好支持暗夜模式

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

  你可以通过将`css`的`key`设置为内置名称来覆盖内置的链接。

  2. 设置`codeTheme`

  ```jsx
  <MdEditor codeTheme="xxxxx" />
  ```

### 🛠 扩展库替换

highlight、prettier、cropper、screenfull 均使用外链引入，在无外网的时候，部分可将项目中已安装的依赖传入，也可以使用下载好的引用。

`screenfull` 的例子：

#### ⚰️ 内置实例

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
// 引用screenfull
import screenfull from 'screenfull';

MdEditor.config({
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
```

#### 📡 内网链接

对应的 js 文件可以去[unpkg.com](https://unpkg.com)，直接找到对应的文件下载即可。

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
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} />;
};
```

### 📷 图片上传

默认可以选择多张图片，支持截图粘贴板上传图片，支持复制网页图片粘贴上传。

> 注意：粘贴板上传时，如果是网页上的 gif 图，无法正确上传为 gif 格式！请保存本地后再手动上传。

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
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} onUploadImg={onUploadImg} />;
};
```

### 🏳️‍🌈 语言扩展与替换

```js
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

MdEditor.config({
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
      }
    }
  }
});

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [language] = useState('my-lang');

  return <MdEditor modelValue={text} onChange={setText} language={language} />;
};
```

你也可以使用现成的扩展语言：[md-editor-extension](https://github.com/imzbf/md-editor-extension)。使用及贡献方式见扩展库文档~

### 🛬 自定义目录结构

需求：在标题中存在外链时，点击打开新窗口。

实现：

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

const getId = (_text, _level, index) => {
  return `heading-${index}`;
};

MdEditor.config({
  markedRenderer(renderer) {
    renderer.link = (href, title, text) => {
      return `<a href="${href}" title="${title || ''}" target="_blank">${text}</a>`;
    };

    renderer.heading = (text, level, raw, _s, index) => {
      // 你不能直接调用默认的markedHeadingId，但是它很简单
      // 如果你的id与raw不相同，请一定记得将你的生成方法通过markedHeadingId告诉编辑器
      // 否则编辑器默认的目录定位功能无法正确使用
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
  const [text, setText] = useState('hello md-editor-rt！');
  return <MdEditor modelValue={text} onChange={setText} markedHeadingId={getId} />;
};
```

### 📄 目录获取与展示

- 获取

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

  export default () => {
    const [text, setText] = useState('hello md-editor-rt！');
    const [catalogList, setList] = useState([]);

    return <MdEditor modelValue={text} onChange={setText} onGetCatalog={setList} />;
  };
  ```

- 展示

  使用内置`MdEditor.MdCatalog`组件

  ```jsx
  import React, { useState } from 'react';
  import MdEditor from 'md-editor-rt';
  import 'md-editor-rt/lib/style.css';

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

### 🪚 调整工具栏

从`v1.2.0`开始，支持调整工具栏内容顺序和分割符了 🤔。

```jsx
import React, { useState } from 'react';
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  const [toolbars] = useState(['italic', 'underline', '-', 'bold', '=', 'github']);

  return <MdEditor modelValue={text} onChange={setText} toolbars={toolbars} />;
};
```

### 💪 自定义工具栏

这里包含了`mark`标记扩展普通工具栏和`emoji`扩展下拉工具栏的类型

可运行源码参考本文档[docs](https://github.com/imzbf/md-editor-rt/blob/docs/src/pages/Preview/index.jsx)。

![标记及Emoji预览](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif)

> 更多 emoji，[https://getemoji.com/](https://getemoji.com/)。

### 🧙‍♂️ 调整编辑器样式

2.x 使用 css 变量定义了大部分内容：

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

.md-editor {
  .css-vars(false);
}

.md-editor-dark {
  .css-vars(true);
}
```

只需要调整对应的 css 变量，比如调整暗夜模式下的背景：

```css
.md-editor-dark {
  --md-bk-color: #333 !important;
}
```

### 🙍🏻‍♂️ 自行引入扩展库

这里给出一个完全不使用外部链接，全部自行引入的示例：

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

> 注意：highlight 的样式自行引入后，将不支持切换代码样式。

## 🔒 xss 防范

在`1.3.0`之后，通过`sanitize`事件，自行处理不安全的 html 内容。例如：使用`sanitize-html`处理

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

更详细的实现可以参考本文档的源码！

## 🧻 编辑此页面

[demo-zh-CN](https://github.com/imzbf/md-editor-rt/blob/dev-docs/public/demo-zh-CN.md)
