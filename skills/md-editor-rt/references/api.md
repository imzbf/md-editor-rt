# md-editor-rt 公开 API 速查

> 基于 `md-editor-rt@6.4.2` 整理。若用户项目版本不同，先核对本地安装包类型定义。

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

主入口 `packages/index.ts` / `packages/preview.ts` 暴露了这些能力：

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
- `editorExtensionsAttrs`
- `editorConfig`
- `codeMirrorExtensions(extensions, { editorId, theme, keyBindings })`
- `markdownItConfig(md, { editorId })`
- `markdownItPlugins(plugins, { editorId })`
- `mermaidConfig(base)`
- `katexConfig(base)`
- `echartsConfig(base)`

高优先级规则：

- 默认在应用入口初始化，如 `main.tsx`、`app/providers.tsx`
- 不要在 React 组件 render / effect 里反复调用
- 自定义 CodeMirror / markdown-it 时先保留内置扩展，再做增删改

## 8. 安全与 HTML 清洗

当前版本默认没有内置 XSS 插件，需要业务自己决定策略：

- 轻量做法：传 `sanitize(html)`
- 统一做法：在 `config({ markdownItPlugins })` 里接入 `XSSPlugin`

同时评估：

- 是否允许 Markdown 中的原生 HTML
- 是否需要单独处理 Mermaid 结果：`sanitizeMermaid`
- 是否要统一 CSP / 外链策略

## 9. 清理副作用

`clearSideEffects()` 用于清理组件运行期间插入到页面里的默认外部资源标签。

典型场景：

- 微前端切换应用
- 页面卸载后希望移除自动插入的 CDN 资源
- 测试环境需要显式清理

## 10. 用户项目里如何核对当前版本 API

按这个顺序核对：

1. `node_modules/md-editor-rt/package.json`
2. `node_modules/md-editor-rt/lib/types/index.d.ts`
3. 如果示例和类型冲突，以当前类型定义为准
4. 仍不确定时，再回到仓库源码核对 `packages/` 下对应实现
