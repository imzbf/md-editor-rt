# md-editor-rt 架构与实现理念

> 这份文档用于进阶排障。默认先解决用户项目接入问题，再回来看内部机制。

## 目录

- [1. 组件分层](#1-组件分层)
- [2. 为什么扩展点被拆成两条链](#2-为什么扩展点被拆成两条链)
- [3. 为什么默认走“重依赖延迟注入”](#3-为什么默认走重依赖延迟注入)
- [4. 为什么 `id` / `editorId` 这么关键](#4-为什么-id--editorid-这么关键)
- [5. 为什么 `MdPreview` 不是旧 `previewOnly` 的简单别名](#5-为什么-mdpreview-不是旧-previewonly-的简单别名)
- [6. Markdown 渲染管线里默认做了什么](#6-markdown-渲染管线里默认做了什么)
- [7. 为什么 ref API 很适合业务集成](#7-为什么-ref-api-很适合业务集成)
- [8. 为什么示例代码不能高于类型定义](#8-为什么示例代码不能高于类型定义)

## 1. 组件分层

公开导出大致分成三层：

- 主组件
  - `MdEditor`
  - `MdPreview`
  - `MdCatalog`
- 可复用的工具栏 / 页脚组件
  - `NormalToolbar`
  - `DropdownToolbar`
  - `ModalToolbar`
  - `MdModal`
  - `NormalFooterToolbar`
- 全局能力
  - `config`
  - `XSSPlugin`
  - `clearSideEffects`
  - `zh_CN` / `en_US`

`MdEditor` 内部再拆成：

- `Toolbar`
- `Content`
  - CodeMirror 编辑区
  - Markdown 预览区
  - HTML 预览区
  - 内置目录区
- `Footer`
- `FloatingToolbar`
- `Modals`

对应源码入口：

- `packages/MdEditor/Editor.tsx`
- `packages/MdPreview/index.tsx`
- `packages/MdCatalog/index.tsx`

## 2. 为什么扩展点被拆成两条链

库把“编辑体验”和“渲染结果”明确分开：

- 编辑体验走 CodeMirror 6 扩展体系
- 渲染结果走 markdown-it 插件体系

这意味着：

- 想加自动补全、快捷键、编辑器主题、浮动工具栏，应该先看 `codeMirrorExtensions`
- 想加 Markdown 语法、改代码块 HTML、接 XSS 处理、调整标题 id，应该先看 `markdownItConfig` / `markdownItPlugins`

对应源码：

- `packages/MdEditor/layouts/Content/hooks/useCodeMirror.ts`
- `packages/MdEditor/layouts/Content/hooks/useMarkdownIt.ts`

## 3. 为什么默认走“重依赖延迟注入”

库没有强迫业务项目安装所有富文本能力依赖，而是把这类依赖放进全局 `editorExtensions`：

- `highlight`
- `prettier`
- `cropper`
- `screenfull`
- `mermaid`
- `katex`
- `echarts`

默认行为：

- 没传本地实例时，可按配置走外链资源
- 业务要求更严格时，可在应用启动阶段通过 `config()` 注入本地实例

这让库在“快速接入”和“正式业务接入”之间保留了弹性，但也带来了 CSP、内网、Electron、副作用管理等问题。

## 4. 为什么 `id` / `editorId` 这么关键

它们不仅是 DOM 标识，更是内部事件总线和目录联动的绑定键：

- `MdEditor` / `MdPreview` 会围绕该 id 建立事件通道
- `MdCatalog` 通过 `editorId` 监听目录变化和滚动联动
- ref API、目录同步、预览重渲染都依赖同一组标识

当前版本里：

- `MdEditor` / `MdPreview` 新代码优先用 `id`
- `editorId` 仅视为兼容旧代码
- `MdCatalog` 仍然使用 `editorId`

因此只要牵涉跨组件联动，就不要随手混用字段名。

## 5. 为什么 `MdPreview` 不是旧 `previewOnly` 的简单别名

`MdPreview` 的定位是“独立的只读渲染组件”，而不是在编辑器里塞一个开关：

- 不需要编辑区与编辑事件
- 更适合文章详情页、文档页、SSR 预览页
- 配套 `preview.css`，而不是完整编辑器样式
- 暴露面更小，业务语义更清晰

所以在只读场景继续使用旧 `previewOnly` 思路，通常会让代码更重、语义更乱，也更容易踩旧 API 坑。

## 6. Markdown 渲染管线里默认做了什么

预览链路一般会围绕这些能力展开：

- markdown-it 基础解析
- 标题 id 生成
- 任务列表、代码块、Mermaid、KaTeX、ECharts 等扩展处理
- 目录数据收集
- 代码复制、图片放大、重挂载 / 重渲染等补充行为

相关实现主要集中在：

- `packages/MdEditor/layouts/Content/markdownIt/*`
- `packages/MdEditor/layouts/Content/hooks/useHighlight.ts`
- `packages/MdEditor/layouts/Content/hooks/useMermaid.ts`
- `packages/MdEditor/layouts/Content/hooks/useKatex.ts`
- `packages/MdEditor/layouts/Content/hooks/useEcharts.ts`

## 7. 为什么 ref API 很适合业务集成

业务项目经常需要：

- 外部按钮触发保存
- AI 结果写回编辑器
- 切换预览 / HTML / 全屏状态
- 手动重渲染
- 获取选中文本或编辑器实例

如果每次都绕回 props 和外层状态，链路会很长；ref API 可以把这些“命令式操作”显式化，特别适合业务编排。

## 8. 为什么示例代码不能高于类型定义

`README`、文档站示例和历史博客可能仍保留旧写法，例如：

- `modelValue`
- `editorId`
- 旧版 `mdHeadingId` 签名
- 旧版 `codeMirrorExtensions` 参数顺序

当示例与当前类型定义冲突时：

1. 先以 `lib/types/index.d.ts` 为准
2. 再结合当前源码实现确认
3. 最后再决定是否兼容旧项目写法
