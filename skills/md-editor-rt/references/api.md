# md-editor-rt 公开 API 速查

> 以 7.x 公开 API 和当前源码为参考。安装包可能尚未包含最新修复；先核对业务项目的版本和 `lib/types/index.d.ts`，再使用对应能力。

## 目录

- [1. 公开导出](#1-公开导出)
- [2. `MdPreview` 关键 props](#2-mdpreview-关键-props)
- [3. `MdEditor` 增量 props](#3-mdeditor-增量-props)
- [4. `MdEditor` / `MdPreview` ref API](#4-mdeditor--mdpreview-ref-api)
- [5. `MdCatalog`](#5-mdcatalog)
- [6. 自定义工具栏 / 页脚组件](#6-自定义工具栏--页脚组件)
- [7. `config()` 全局配置](#7-config-全局配置)
- [8. 安全与 HTML 清洗](#8-安全与-html-清洗)
- [9. 清理副作用](#9-清理副作用)
- [10. 用户项目里如何核对当前版本 API](#10-用户项目里如何核对当前版本-api)

## 1. 公开导出

从 `md-editor-rt` 主入口导入以下能力；源码入口为 `packages/index.ts`，其中部分预览能力由 `packages/preview.ts` 复用：

- `MdEditor`
- `MdPreview`
- `MdCatalog`
- `NormalToolbar`
- `DropdownToolbar`
- `ModalToolbar`
- `MdModal`
- `StrIcon`
- `NormalFooterToolbar`
- `config`
- `allToolbar`
- `allFooter`
- `editorExtensionsAttrs`
- `clearSideEffects`
- `XSSPlugin`
- `prefix`
- `zh_CN` / `en_US`
- 类型导出，例如 `ExposeParam`、`ExposePreviewParam`、`MdHeadingId`、`ToolbarNames`

样式入口：

- 编辑器：`md-editor-rt/lib/style.css`
- 仅预览：`md-editor-rt/lib/preview.css`

## 2. `MdPreview` 关键 props

最常用：

- `value`
- `onChange`
- `theme`: `'light' | 'dark'`
- `language`
- `previewTheme`
- `codeTheme`
- `id`
- `onHtmlChanged`
- `onGetCatalog`
- `mdHeadingId`
- `sanitize`

兼容旧代码：

- `modelValue`：`value` 的旧别名
- `editorId`：`id` 的旧别名

预览能力与渲染控制：

- `showCodeRowNumber`
- `noMermaid`
- `noKatex`
- `noHighlight`
- `noEcharts`
- `noImgZoomIn`
- `sanitizeMermaid`
- `formatCopiedText`
- `previewComponent`
- `onRemount`
- `codeFoldable`
- `autoFoldThreshold`

提醒：

- 新代码优先用 `value` + `id`
- 如果要给外部 `MdCatalog` 绑定，`MdPreview.id` 必须与 `MdCatalog.editorId` 一致

## 3. `MdEditor` 增量 props

在 `MdPreview` 的基础上，`MdEditor` 额外常用这些：

- `onSave`
- `onUploadImg`
- `pageFullscreen`
- `preview`
- `htmlPreview`
- `toolbars`
- `toolbarsExclude`
- `floatingToolbars`
- `footers`
- `defToolbars`
- `defFooters`
- `scrollAuto`
- `catalogLayout`
- `catalogMaxDepth`
- `placeholder`
- `tabWidth`
- `autoFocus`
- `disabled`
- `readOnly`
- `maxLength`
- `autoDetectCode`
- `showToolbarName`
- `customIcon`
- `completions`
- `inputBoxWidth`
- `onInputBoxWidthChange`
- `transformImgUrl`
- `noPrettier`
- `noUploadImg`

高频易错点：

- `onSave(value, htmlPromise)` 的第二个参数是 `Promise<string>`
- `defToolbars` / `defFooters` 要配合 `toolbars` / `footers` 中的数字占位符使用
- 目录栏联动有两种：编辑器内部目录、外置 `MdCatalog`

## 4. `MdEditor` / `MdPreview` ref API

`MdEditor` 暴露：

- `on(eventName, callback)`
- `togglePageFullscreen(status?)`
- `toggleFullscreen(status?)`
- `togglePreview(status?)`
- `togglePreviewOnly(status?)`
- `toggleHtmlPreview(status?)`
- `toggleCatalog(status?)`
- `triggerSave()`
- `insert(generate)`
- `focus(options?)`
- `rerender()`
- `getSelectedText()`
- `resetHistory()`
- `domEventHandlers(handlers)`
- `execCommand(direct)`
- `getEditorView()`

`MdPreview` 只暴露：

- `rerender()`

适用场景：

- 外部按钮控制编辑器状态：用 ref API
- 想在业务逻辑里主动触发保存：用 `triggerSave()`
- 想插入模板或 AI 生成内容：用 `insert()` 或 `execCommand()`

## 5. `MdCatalog`

关键 props：

- `editorId`: 目标编辑器 / 预览器的 `id`
- `mdHeadingId`
- `scrollElement?: string | HTMLElement`
- `offsetTop`
- `scrollElementOffsetTop`
- `theme`
- `syncWith?: 'editor' | 'preview'`
- `catalogMaxDepth`
- `isScrollElementInShadow`

关键事件：

- `onClick`
- `onActive`

提醒：

- `MdCatalog` 仍然使用 `editorId`，不要写成 `id`
- `scrollElement` 为字符串时必须是可查询到的选择器
- 整页滚动场景常传 `document.documentElement`
- SSR 下应改传字符串，如 `html`
- `scrollElement` 指向的元素应已定位且确实承担滚动

## 6. 自定义工具栏 / 页脚组件

工具栏相关：

- `NormalToolbar`
- `DropdownToolbar`
- `ModalToolbar`
- `MdModal`

页脚相关：

- `NormalFooterToolbar`

约定：

- 在 `defToolbars` / `defFooters` 放自定义 React 组件
- 在 `toolbars` / `footers` 中插入对应数字下标决定展示位置
- 这不是“按名字注册”，而是“按下标占位”

下拉工具栏需要同时维护 `visible` 和 `onChange`；弹窗工具栏需要维护 `visible`、打开回调与 `onClose`。菜单动作优先使用带 `role="menuitem"` 的原生按钮，配合有名称的菜单容器；表单内容保留原生输入控件，不强行标记为菜单。参见 [可运行的工具栏模式](playbook.md#7-自定义工具栏)。

## 7. `config()` 全局配置

`config()` 能改这些核心能力：

- `editorExtensions`
  - `highlight`
  - `prettier`
  - `cropper`
  - `screenfull`
  - `mermaid`
  - `katex`
  - `echarts`
    - `editorExtensions.echarts.parseOption(code, { editorId, element })`
    - `>=6.5.0` 支持；用于自定义 ECharts 代码块内容解析
    - `editorExtensions.echarts.sanitizeOption(option, { editorId, element })` 在 `echartsConfig` 之后同步处理渲染配置
- `editorExtensionsAttrs`
- `editorConfig`
- `codeMirrorExtensions(extensions, { editorId, theme, keyBindings })`
- `markdownItConfig(md, { editorId })`
- `markdownItPlugins(plugins, { editorId })`
- `mermaidConfig(base)`
- `katexConfig(base)`
- `echartsConfig(base)`
  - 只处理解析后的 option，不负责解析代码块文本

高优先级规则：

- 默认在应用入口初始化，如 `main.tsx`、`app/providers.tsx`
- 不要在 React 组件 render / effect 里反复调用
- 自定义 CodeMirror / markdown-it 时先保留内置扩展，再做增删改
- ECharts 代码块解析版本边界：
  - `<6.5.0`：历史版本不支持 `parseOption`。
  - `>=6.5.0 <7.0.0`：支持 `parseOption`，默认解析行为沿用旧版本。
  - `>=7.0.0`：默认使用 `JSON5.parse`，只接受对象数据且不会执行代码；仍可通过 `editorExtensions.echarts.parseOption` 自定义解析器。

## 8. 安全与 HTML 清洗

原生 HTML 默认关闭，Mermaid 默认 `securityLevel: 'strict'`，KaTeX 默认 `trust: false`。替换依赖实例会保留这些默认配置。

- 显式开启原生 HTML 时，根据输入来源选择 `sanitize(html)` 或 `XSSPlugin`；后者仅清洗 HTML token。
- `sanitizeMermaid(svg)` 是异步 SVG 后处理入口，不等同于 `mermaidConfig`。
- ECharts 按 `parseOption → echartsConfig → sanitizeOption → setOption` 执行；自定义解析器不会自动关闭渲染防护。
- 应用提供的 renderer、插件、解析器和回调属于应用代码。按业务需要单独调整对应模块。

## 9. 清理副作用

`clearSideEffects()` 移除页面共享的 CDN script/link 标签，不是单个组件的销毁方法。组件卸载会自行释放实例监听；仅在使用这些共享资源的所有实例卸载后，由微前端或页面宿主统一清理。

完全通过本地实例和应用 CSS 管理资源时，通常不需要调用。该函数访问 `document`，只能在客户端执行。

## 10. 用户项目里如何核对当前版本 API

按这个顺序核对：

1. `node_modules/md-editor-rt/package.json`
2. `node_modules/md-editor-rt/lib/types/index.d.ts`
3. 如果示例和类型冲突，以当前类型定义为准
4. 仍不确定时，再回到仓库源码核对 `packages/` 下对应实现
