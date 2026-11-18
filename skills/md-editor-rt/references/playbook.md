# md-editor-rt 实战模式

> 先按这里的模式接入，再做进阶定制。示例默认面向 React 18+ 下游业务项目。

## 目录

- [1. 最小可编辑接入](#1-最小可编辑接入)
- [2. 只预览 + 外置目录](#2-只预览--外置目录)
- [2.1 Next / SSR 快速检查清单](#21-next--ssr-快速检查清单)
- [2.2 在可编辑模式下接外置目录](#22-在可编辑模式下接外置目录)
- [3. 在应用启动阶段注入本地依赖实例](#3-在应用启动阶段注入本地依赖实例)
- [3.1 一次性替换常见本地实例](#31-一次性替换常见本地实例)
- [3.2 ECharts 配置解析](#32-echarts-配置解析)
- [3.3 按模块开放受信任能力](#33-按模块开放受信任能力)
- [4. 图片上传](#4-图片上传)
- [4.1 图片上传排查清单](#41-图片上传排查清单)
- [5. 保存时拿到最新 HTML](#5-保存时拿到最新-html)
- [6. 外部通过 ref 控制编辑器](#6-外部通过-ref-控制编辑器)
- [7. 自定义工具栏](#7-自定义工具栏)
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
const scrollElement = 'html';

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

字符串选择器同时适用于客户端和 SSR；这里的 `html` 对应整页滚动。自定义容器应传实际滚动元素的选择器。

## 2.1 Next / SSR 快速检查清单

出现目录不同步、hydration 不一致或服务端报错时，优先检查：

1. App Router 的交互组件是否处于 `'use client'` 边界内；Pages Router 不需要该指令
2. 如果存在外置目录或外部控制逻辑，是否给 `MdEditor` / `MdPreview` 显式传了同一个 `id`
3. `MdCatalog` 是否继续使用同一个 `editorId`
4. `scrollElement` 是否在 SSR 场景下传了字符串选择器，而不是 `document.documentElement`
5. 是否已经把只读场景拆成了 `MdPreview`

Pages Router 的全局样式放在 `pages/_app`；App Router 可放在根布局。先定位实际不满足的接入条件，再考虑其他原因。

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

下面的完整配置适用于需要离线运行的浏览器入口；只用部分功能时，按 [依赖矩阵](dependency-matrix.md) 保留所需实例并关闭未使用的能力。

```ts
import { config } from 'md-editor-rt';
import highlight from 'highlight.js';
import mermaid from 'mermaid';
import katex from 'katex';
import Cropper from 'cropperjs';
import screenfull from 'screenfull';
import * as echarts from 'echarts';
import * as prettier from 'prettier/standalone';
import parserMarkdown from 'prettier/plugins/markdown';
import 'highlight.js/styles/atom-one-dark.css';
import 'katex/dist/katex.min.css';
import 'cropperjs/dist/cropper.css';

config({
  editorExtensions: {
    highlight: { instance: highlight },
    mermaid: { instance: mermaid },
    katex: { instance: katex },
    cropper: { instance: Cropper },
    screenfull: { instance: screenfull },
    echarts: { instance: echarts },
    prettier: {
      prettierInstance: prettier,
      parserMarkdownInstance: parserMarkdown
    }
  }
});
```

## 3.1 一次性替换常见本地实例

- 安装与实例 API 兼容的版本：Cropper.js 使用 1.x；本地 screenfull 可使用 ESM 6.x。
- Prettier 使用浏览器入口 `prettier/standalone`，不要从 Node 主入口导入。
- ECharts 使用命名空间导入；上面的配置也覆盖了这个可选模块。
- 同一套配置在应用初始化时设置，不在每个组件实例或重渲染时调用。
- 提供本地高亮实例后，代码主题 CSS 由应用管理；切换 `codeTheme` 不会自动替换已导入的本地 CSS。
- Web Component 需要将组件 CSS 注入 Shadow DOM，并在文档中注册字体，见对应 [examples](https://github.com/imzbf/md-editor-rt/tree/develop/examples)。

## 3.2 ECharts 配置解析

`>=6.5.0` 支持通过 `editorExtensions.echarts.parseOption` 自定义 ECharts 代码块解析。7.x 默认使用 `JSON5.parse`，只接受对象数据且不会执行代码；例如，需要严格 JSON 格式时可在应用启动阶段覆盖解析器：

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

如果业务需要兼容 ECharts 官方示例里的函数写法，可以显式配置执行型解析器，但只应在内容可信时使用：

```ts
config({
  editorExtensions: {
    echarts: {
      parseOption(code) {
        // eslint-disable-next-line no-new-func
        return new Function(`"use strict"; return (${code}\n);`)();
      }
    }
  }
});
```

渲染链按 `parseOption → echartsConfig → sanitizeOption → setOption` 执行。上例只开放 JavaScript 解析，默认仍将 tooltip 设为 `richText`、转义数据视图文案并过滤危险跳转协议。格式化模板中的 HTML 会作为文本显示。

当内容及回调都可信，而且需要 HTML tooltip 等完整渲染能力时，再独立开放渲染策略：

```ts
config({
  editorExtensions: {
    echarts: {
      sanitizeOption: (option) => option
    }
  }
});
```

`sanitizeOption` 是同步函数，接收 `(option, { editorId, element })`，返回交给 `setOption` 的对象。自定义它会接管整个渲染安全处理；JSON5 解析失败不会自动尝试 `new Function`。执行型解析器仍受宿主 CSP 限制。

## 3.3 按模块开放受信任能力

下面各项相互独立，在应用挂载前只配置需要开放的模块。

```ts
import { config } from 'md-editor-rt';

// 原生 HTML：默认 html:false，显式开启后可按需搭配 sanitize 或 XSSPlugin。
config({
  markdownItConfig(md) {
    md.set({ html: true });
  }
});

// Mermaid：默认 strict；loose 允许受信任的图表交互，插入 SVG 后会绑定回调。
config({
  mermaidConfig(base) {
    return { ...base, securityLevel: 'loose' };
  }
});

// KaTeX：默认 trust:false，也可将 trust 设为按命令和协议判断的函数。
config({
  katexConfig(base) {
    return { ...base, trust: true };
  }
});
```

普通主题配置和依赖实例替换会继续继承安全默认值。Mermaid 文档中的 frontmatter / init 指令不能覆盖 `securityLevel`、`secure`、`dompurifyConfig` 等受保护配置；这些选项由应用的 `mermaidConfig` 决定。`sanitizeMermaid` 保持异步后处理接口，更换它或切换主题会使当前预览的 SVG 缓存失效。

默认安全边界覆盖文档内容。应用注入的 renderer、插件、解析器和回调属于受信任代码，需要与文档数据区分。

浏览器专用依赖的初始化模块应放在客户端入口。Nuxt 可使用 `.client.ts` 插件；Next 中若某个依赖在导入时访问 DOM，再通过客户端动态导入加载，并在配置完成后挂载编辑器。不要仅为了避免业务代码中的 DOM 访问而关闭整个页面的 SSR。

## 4. 图片上传

```tsx
import { MdEditor, type UploadImgEvent } from 'md-editor-rt';

const onUploadImg: UploadImgEvent = async (files, callback) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!response.ok) throw new Error('上传失败');
      const res = await response.json();

      return res.url;
    })
  );

  callback(urls);
};

<MdEditor value={text} onChange={setText} onUploadImg={onUploadImg} />;
```

接口片段约定 `/api/upload` 返回 `{ url: string }`，上传异常需要接入业务的错误提示。

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
import { useRef, useState } from 'react';
import { MdEditor, type ExposeParam } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function Demo() {
  const editorRef = useRef<ExposeParam>(null);
  const [text, setText] = useState('# 引用模板');

  return (
    <>
      <button type="button" onClick={() => editorRef.current?.togglePreview(true)}>
        显示预览
      </button>
      <button
        type="button"
        onClick={() => {
          editorRef.current?.insert((selectedText) => ({
            targetValue: `> ${selectedText || '引用内容'}`,
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

## 7. 自定义工具栏

```tsx
import { useRef, useState } from 'react';
import {
  MdEditor,
  DropdownToolbar,
  NormalFooterToolbar,
  type ExposeParam
} from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default function TemplateEditor() {
  const [text, setText] = useState('');
  const [visible, setVisible] = useState(false);
  const editorRef = useRef<ExposeParam>(null);

  const insertQuote = () => {
    editorRef.current?.insert((selectedText) => ({
      targetValue: `> ${selectedText || '引用内容'}`,
      select: false
    }));
    setVisible(false);
  };

  return (
    <MdEditor
      ref={editorRef}
      value={text}
      onChange={setText}
      toolbars={['bold', 'italic', 0, '=', 'preview']}
      defToolbars={[
        <DropdownToolbar
          key="templates"
          title="插入模板"
          visible={visible}
          onChange={setVisible}
          overlay={
            <div role="menu" aria-label="模板">
              <button type="button" role="menuitem" onClick={insertQuote}>
                引用
              </button>
            </div>
          }
        >
          模板
        </DropdownToolbar>
      ]}
      footers={['markdownTotal', '=', 0]}
      defFooters={[<NormalFooterToolbar key="status">草稿</NormalFooterToolbar>]}
    />
  );
}
```

数字 `0` 对应第一个自定义节点。`visible` 与 `onChange` 共同维护下拉状态；原生菜单按钮配合内置键盘导航。表单下拉则保留输入控件的原生语义，不给它们强加菜单角色。

## 8. 扩展 markdown-it 插件链

```ts
import { config } from 'md-editor-rt';

config({
  markdownItConfig(md) {
    md.set({ typographer: true });
  },
  markdownItPlugins(plugins) {
    return plugins.map((item) =>
      item.type === 'image'
        ? { ...item, options: { ...item.options, figcaption: false } }
        : item
    );
  }
});
```

这里只修改排版选项和图片说明，保留标题、任务列表、代码块等内置插件。需要处理业务允许的原生 HTML 时，再按 [安全与 HTML 清洗](api.md#8-安全与-html-清洗) 接入 `XSSPlugin` 或 `sanitize`。

## 9. 扩展 CodeMirror 6

```tsx
import { lineNumbers } from '@codemirror/view';
import { config } from 'md-editor-rt';

config({
  codeMirrorExtensions(extensions) {
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
- 微前端 / 单页切换：仅在所有使用共享 CDN 资源的实例卸载后调用 `clearSideEffects()`

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
