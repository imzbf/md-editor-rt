## 😁 基本使用示例

目前一直在迭代开发，所以尽量安装最新版本。发布日志请前往：[releases](https://github.com/imzbf/md-editor-rt/releases)

### 🤖 安装

```shell
yarn add md-editor-rt
```

### 🤓 基本使用

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');
  return <Editor modelValue={text} onChange={setText} />;
}
```

## 🥂 扩展功能

这里包含了一些编辑器`api`的使用示范

### 🍦 主题切换

在`v1.1.0`版本后，主题分为了编辑器主题（`theme`，称为全局主题）和预览内容主题（`previewTheme`）。

#### 🍧 编辑器主题

支持默认和暗夜模式两种

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

#### 🍡 预览主题

内置了`default`、`github`、`vuepress`三种主题，在一些直接预览文档内容时使用。并且支持在线切换（修改`previewTheme`即可）。

样式规则：

- `default`、`vuepress`主题下，切换编辑器全局主题`theme`时，代码样式不会跟随变更；
- `github`主题下，切换编辑器全局主题`theme`时，代码样式会动态的从`github-light`变为`github-dark`。

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

### 🛠 扩展库替换

highlight、prettier、cropper、screenfull 均使用外链引入，在无外网的时候，部分可将项目中已安装的依赖传入，也可以使用下载好的引用。

演示替换`screenfull`

#### ⚰️ 已安装依赖

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

#### 📡 内网链接

对应的 js 文件可以去[https://www.jsdelivr.com/](https://www.jsdelivr.com/)，直接找到对应的文件下载即可。

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

### 📷 图片上传

默认可以选择多张图片，支持截图粘贴板上传图片，支持复制网页图片粘贴上传。

> 图片裁剪上传只支持选择一张图片~，但回调入仍是一个文件数组。

> 注意：粘贴板上传时，如果是网页上的 gif 图，无法正确上传为 gif 格式！请保存本地后再手动上传。

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

### 🏳️‍🌈 语言扩展与替换

```js
import React, { useState } from 'react';
import Editor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function App() {
  const [text, setText] = useState('hello md-editor-rt！');

  const [language] = useState('my-lang');
  const [languageUserDefined] = useState({
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
        revoke: '后退',
        next: '前进',
        save: '保存',
        prettier: '美化',
        pageFullscreen: '浏览器全屏',
        fullscreen: '屏幕全屏',
        catalog: '目录',
        preview: '预览',
        htmlPreview: 'html代码预览',
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
        tips: '已复制！'
      }
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

### 📄 目录获取与展示

先通过`onGetCatalog`方法获取到渲染成功后的标题列表：

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

若项目中使用的 ui 库有锚点类似的组件，请继续看下去（案例使用 antd 组件库）：

创建组件`Catalog`，源码地址：[Catalog 源码](https://github.com/imzbf/md-editor-rt/tree/dev-docs/src/components/Catalog)

### 🪚 调整工具栏

从`v1.2.0`开始，支持调整工具栏内容顺序和分割符了 🤔。

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

更详细的实现可以参考本文档的源码！

## 🧻 结束
