# md-editor-rt 常见坑点

## 目录

- [1. 导错样式文件](#1-导错样式文件)
- [2. 新代码继续使用旧 `modelValue` / `editorId`](#2-新代码继续使用旧-modelvalue--editorid)
- [3. `MdCatalog` 绑定错字段](#3-mdcatalog-绑定错字段)
- [4. 继续使用旧 `previewOnly` prop](#4-继续使用旧-previewonly-prop)
- [5. `onSave` 误当同步 HTML](#5-onsave-误当同步-html)
- [6. 自定义工具栏或页脚顺序错乱](#6-自定义工具栏或页脚顺序错乱)
- [7. 在组件内部频繁调用 `config()`](#7-在组件内部频繁调用-config)
- [8. 忽略 HTML / XSS 风险](#8-忽略-html--xss-风险)
- [9. 忽略外链副作用](#9-忽略外链副作用)
- [10. 预览目录不跟随滚动](#10-预览目录不跟随滚动)
- [11. `scrollElement` 指向了错误或未定位的滚动容器](#11-scrollelement-指向了错误或未定位的滚动容器)
- [12. Next / SSR 路径里直接访问了 `document` 或 `window`](#12-next--ssr-路径里直接访问了-document-或-window)
- [13. 继续沿用旧 `mdHeadingId` / `codeMirrorExtensions` 签名](#13-继续沿用旧-mdheadingid--codemirrorextensions-签名)
- [14. 自定义 markdown-it / CodeMirror 时把内置能力全丢了](#14-自定义-markdown-it--codemirror-时把内置能力全丢了)

## 1. 导错样式文件

症状：

- `MdPreview` 看起来像半残的编辑器
- 目录或预览样式异常

处理：

- `MdEditor` 用 `lib/style.css`
- `MdPreview` 用 `lib/preview.css`

## 2. 新代码继续使用旧 `modelValue` / `editorId`

现状：

- 仍然兼容
- 但当前类型已经把 `value` / `id` 作为新写法

处理：

- 新代码优先用 `value`
- `MdEditor` / `MdPreview` 优先用 `id`
- 仅在旧项目增量兼容时保留旧字段

## 3. `MdCatalog` 绑定错字段

常见误解：

- 给 `MdCatalog` 传 `id`

实际：

- `MdCatalog` 用的是 `editorId`
- `MdPreview` / `MdEditor` 新代码优先用 `id`

所以目录接入时往往需要写成：

```jsx
<MdPreview id={previewId} value={text} />
<MdCatalog editorId={previewId} />
```

## 4. 继续使用旧 `previewOnly` prop

现状：

- 旧 `previewOnly` prop 已移除
- 只读场景应改用 `MdPreview`

处理：

- 新代码不要再尝试给 `MdEditor` 传 `previewOnly`

## 5. `onSave` 误当同步 HTML

症状：

- 保存时拿到旧 HTML
- 公式 / Mermaid / 图表还没替换完成

处理：

- `onSave` 第二个参数按 `Promise<string>` 处理
- 真正落库前 `await htmlPromise`

## 6. 自定义工具栏或页脚顺序错乱

症状：

- 自定义组件不显示
- 位置和预期不一致

原因：

- `defToolbars` / `defFooters` 只是组件池
- 真正显示位置由 `toolbars` / `footers` 里的数字占位决定

## 7. 在组件内部频繁调用 `config()`

症状：

- 多实例行为混乱
- 不同页面互相污染
- 调试时看起来像“偶发问题”

处理：

- 把 `config()` 放到应用启动阶段
- 不要在组件 render / effect 中按实例反复执行

## 8. 忽略 HTML / XSS 风险

现状：

- 当前版本默认没有内置 XSS 扩展
- 用户输入的 HTML 是否安全，需要业务自己负责

处理：

- 至少接一个 `sanitize`
- 或在 `markdownItPlugins` 里显式启用 `XSSPlugin`

## 9. 忽略外链副作用

症状：

- 路由切换后页面里残留 script / link
- 微前端场景下资源重复注入

处理：

- 正式业务优先本地实例注入
- 需要清理时调用 `clearSideEffects()`

## 10. 预览目录不跟随滚动

优先检查：

1. `MdPreview.id` 与 `MdCatalog.editorId` 是否一致
2. 是否真的把 `MdCatalog` 绑定到了对应的滚动容器
3. 是否需要 `syncWith="editor"` 而不是默认的 `preview`
4. 标题 id 算法是否在 `MdPreview` 与 `MdCatalog` 之间保持一致

## 11. `scrollElement` 指向了错误或未定位的滚动容器

症状：

- 目录高亮不变化
- 点击目录不滚动或滚动位置不对

处理：

- `scrollElement` 指向真正滚动的容器
- 该容器必须已定位，且内容可滚动
- 如果整页滚动，常用 `document.documentElement`
- 如果有固定头部，再评估 `scrollElementOffsetTop`

## 12. Next / SSR 路径里直接访问了 `document` 或 `window`

症状：

- 服务端报错
- hydration 不一致

处理：

- App Router 下把编辑器包装在 `use client` 组件中
- SSR 场景给 `scrollElement` 传字符串选择器，例如 `html`
- 不要在服务端初始化阶段直接读取 `document.documentElement`

## 13. 继续沿用旧 `mdHeadingId` / `codeMirrorExtensions` 签名

现状：

- `mdHeadingId` 现在接收对象参数
- `codeMirrorExtensions` 现在接收 `extensions` 和 `options`

处理：

- 以 `lib/types/index.d.ts` 为准重写签名
- 不要照搬旧博客或老版本示例

## 14. 自定义 markdown-it / CodeMirror 时把内置能力全丢了

症状：

- 标题、任务列表、Mermaid、快捷键等功能突然失效

处理：

- `markdownItPlugins` 以“筛选 / 追加”内置插件为主
- `codeMirrorExtensions` 以“保留现有扩展后增量修改”为主
- 默认不要把内置列表整组替换为空
