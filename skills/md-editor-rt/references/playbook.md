# md-editor-rt 实战模式

> 先按这里的模式接入，再做进阶定制。示例默认面向 React 18+ 下游业务项目。

## 目录

- [1. 最小可编辑接入](#1-最小可编辑接入)
- [2. 只预览 + 外置目录](#2-只预览--外置目录)
- [2.1 Next / SSR 快速检查清单](#21-next--ssr-快速检查清单)
- [2.2 在可编辑模式下接外置目录](#22-在可编辑模式下接外置目录)
- [3. 在应用启动阶段注入本地依赖实例](#3-在应用启动阶段注入本地依赖实例)
- [3.1 一次性替换常见本地实例](#31-一次性替换常见本地实例)
- [4. 图片上传](#4-图片上传)
- [4.1 图片上传排查清单](#41-图片上传排查清单)
- [5. 保存时拿到最新 HTML](#5-保存时拿到最新-html)
- [6. 外部通过 ref 控制编辑器](#6-外部通过-ref-控制编辑器)
- [7. 自定义工具栏 / 页脚](#7-自定义工具栏--页脚)
- [8. 扩展 markdown-it 插件链](#8-扩展-markdown-it-插件链)
- [9. 扩展 CodeMirror 6](#9-扩展-codemirror-6)
- [10. Next / Web Component / Shadow DOM](#10-next--web-component--shadow-dom)
- [11. 需要替换预览 DOM 外壳时](#11-需要替换预览-dom-外壳时)

## 1. 最小可编辑接入

```tsx
import { useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function Demo() {
  const [text, setText] = useState('# Hello md-editor-rt');

  return <MdEditor value={text} onChange={setText} />;
}
```

适用：

- 普通 React 页面
- 先跑通，再逐步叠加上传、目录、定制工具栏

## 2. 只预览 + 外置目录

```tsx
import { MdPreview, MdCatalog } from 'md-editor-rt';
import 'md-editor-rt/lib/preview.css';

const previewId = 'article-preview';
const scrollElement = document.documentElement;

export default function Article() {
  const text = '# Preview';

  return (
    <>
      <MdPreview id={previewId} value={text} />
      <MdCatalog editorId={previewId} scrollElement={scrollElement} />
    </>
  );
}
```

SSR 下改成：

```ts
const scrollElement = 'html';
```

## 2.1 Next / SSR 快速检查清单

出现目录不同步、hydration 不一致或服务端报错时，优先检查：

1. 编辑器组件是否放在 `use client` 组件中
2. 如果存在外置目录或外部控制逻辑，是否给 `MdEditor` / `MdPreview` 显式传了同一个 `id`
3. `MdCatalog` 是否继续使用同一个 `editorId`
4. `scrollElement` 是否在 SSR 场景下传了字符串选择器，而不是 `document.documentElement`
5. 是否已经把只读场景拆成了 `MdPreview`

默认先修这五项，再看更深层问题。

## 2.2 在可编辑模式下接外置目录

如果想让目录跟编辑区滚动，而不是跟预览区滚动：

```tsx
<MdEditor id="post-editor" value={text} onChange={setText} />
<MdCatalog editorId="post-editor" syncWith="editor" />
```

适用：

- 左侧输入、右侧外置目录
- 希望目录根据编辑光标附近标题联动

## 3. 在应用启动阶段注入本地依赖实例

把全局配置放在应用入口，例如 `main.tsx`、`bootstrap.tsx`、`app/providers.tsx`：

```tsx
import { config } from 'md-editor-rt';
import hljs from 'highlight.js';
import prettier from 'prettier/standalone';
import parserMarkdown from 'prettier/plugins/markdown';
import mermaid from 'mermaid';
import katex from 'katex';
import screenfull from 'screenfull';

config({
  editorExtensions: {
    highlight: { instance: hljs },
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    },
    mermaid: { instance: mermaid },
    katex: { instance: katex },
    screenfull: { instance: screenfull }
  }
});
```

原则：

- 正式业务接入优先本地实例
- `config()` 只做一次
- 样式依赖一并在业务侧引入

## 3.1 一次性替换常见本地实例

如果页面还需要图片裁剪或图表：

```tsx
import cropperjs from 'cropperjs';
import echarts from 'echarts';
import 'cropperjs/dist/cropper.css';
import 'katex/dist/katex.min.css';

config({
  editorExtensions: {
    cropper: { instance: cropperjs },
    echarts: { instance: echarts }
  }
});
```

补充提醒：

- `highlight.js`、`katex`、`cropperjs` 往往还要带对应 CSS
- 如果业务已经自己管理这些依赖，不要再让编辑器走默认外链

## 3.2 ECharts 配置解析

`>=6.5.0` 支持通过 `editorExtensions.echarts.parseOption` 自定义 echarts 代码块解析。当前 `6.5.x` 默认仍用 `new Function`，如果内容来源不可信，建议在应用启动阶段改成严格解析：

```ts
import { config } from 'md-editor-rt';

config({
  editorExtensions: {
    echarts: {
      parseOption(code) {
        return JSON.parse(code);
      }
    }
  }
});
```

未来 `7.0` 计划默认使用 `JSON.parse`。如果升级后仍要兼容 ECharts 官方示例里的函数写法，可以由业务显式配置执行型解析器，但只应在内容可信时使用：

```ts
config({
  editorExtensions: {
    echarts: {
      parseOption(code) {
        // eslint-disable-next-line no-new-func
        return new Function(`return ${code}`)();
      }
    }
  }
});
```

## 4. 图片上传

```tsx
import { MdEditor, type UploadImgEvent } from 'md-editor-rt';

const onUploadImg: UploadImgEvent = async (files, callback) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      }).then((r) => r.json());

      return res.url;
    })
  );

  callback(urls);
};

<MdEditor value={text} onChange={setText} onUploadImg={onUploadImg} />;
```

如果只想关闭上传：

```tsx
<MdEditor noUploadImg value={text} onChange={setText} />
```

## 4.1 图片上传排查清单

1. 是否提供了 `onUploadImg`
2. 返回给 `callback` 的是否是 URL 数组，或包含 `url/alt/title` 的对象数组
3. 是否还需要 `transformImgUrl` 做二次处理
4. 是否因为 `noUploadImg` 或缺少 cropper 依赖导致上传链路不完整

## 5. 保存时拿到最新 HTML

```tsx
<MdEditor
  value={text}
  onChange={setText}
  onSave={async (md, htmlPromise) => {
    const html = await htmlPromise;

    await fetch('/api/article/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ md, html })
    });
  }}
/>
```

不要把第二个参数当同步字符串直接使用。

## 6. 外部通过 ref 控制编辑器

```tsx
import { useRef } from 'react';
import { MdEditor, type ExposeParam } from 'md-editor-rt';

export default function Demo() {
  const editorRef = useRef<ExposeParam>(null);

  return (
    <>
      <button onClick={() => editorRef.current?.togglePreview(true)}>显示预览</button>
      <button onClick={() => editorRef.current?.triggerSave()}>触发保存</button>
      <button
        onClick={() => {
          editorRef.current?.insert((selectedText) => ({
            targetValue: `> ${selectedText || 'AI 摘要'}`,
            select: false
          }));
        }}
      >
        插入引用
      </button>

      <MdEditor ref={editorRef} value={text} onChange={setText} />
    </>
  );
}
```

## 7. 自定义工具栏 / 页脚

```tsx
import { useState } from 'react';
import {
  MdEditor,
  NormalToolbar,
  NormalFooterToolbar,
  type ToolbarNames,
  type Footers
} from 'md-editor-rt';

const MyToolbar = () => (
  <NormalToolbar title="摘要" onClick={() => {}}>
    AI
  </NormalToolbar>
);
const MyFooter = () => <NormalFooterToolbar>发布检查</NormalFooterToolbar>;

const toolbars: ToolbarNames[] = ['bold', 0, '=', 'github'];
const footers: Footers[] = ['markdownTotal', '=', 0];

export default function Demo() {
  const [text, setText] = useState('');

  return (
    <MdEditor
      value={text}
      onChange={setText}
      toolbars={toolbars}
      defToolbars={[<MyToolbar key="ai" />]}
      footers={footers}
      defFooters={[<MyFooter key="check" />]}
    />
  );
}
```

关键点：数字 `0` 表示取 `defToolbars[0]` / `defFooters[0]`。

## 8. 扩展 markdown-it 插件链

```tsx
import anchor from 'markdown-it-anchor';
import { config, XSSPlugin } from 'md-editor-rt';

config({
  markdownItConfig(md) {
    md.use(anchor, { permalink: anchor.permalink.ariaHidden({}) });
  },
  markdownItPlugins(plugins) {
    return [
      ...plugins,
      {
        type: 'xss',
        plugin: XSSPlugin,
        options: {}
      }
    ];
  }
});
```

默认策略：

- 改 markdown-it 行为时，优先增量追加或筛选
- 不要不加判断地把内置插件整组替换掉

## 9. 扩展 CodeMirror 6

```tsx
import { lineNumbers } from '@codemirror/view';
import { config } from 'md-editor-rt';

config({
  codeMirrorExtensions(extensions, { editorId, theme, keyBindings }) {
    return [
      ...extensions,
      {
        type: 'lineNumbers',
        extension: lineNumbers()
      }
    ];
  }
});
```

适用：

- 行号、快捷键、自动补全、浮动工具栏、主题扩展
- 按 `editorId` 做单实例定制

## 10. Next / Web Component / Shadow DOM

- Next App Router：把编辑器放在 `use client` 组件中
- SSR：`scrollElement` 传字符串选择器，不要直接传 DOM
- Web Component / Shadow DOM：目录滚动容器在 shadow root 内时，评估 `isScrollElementInShadow`
- 微前端 / 单页切换：必要时调用 `clearSideEffects()` 清理自动插入的外部资源

## 11. 需要替换预览 DOM 外壳时

如果业务需要自己接管预览根节点，可以用 `previewComponent`：

```tsx
<MdPreview
  id="article-preview"
  value={text}
  previewComponent={({ html, id, className }) => (
    <section id={id} className={className} dangerouslySetInnerHTML={{ __html: html }} />
  )}
/>
```

要求：

- 把 `id` 和 `className` 继续透传到根节点
- 否则目录联动、样式和查询逻辑可能失效
