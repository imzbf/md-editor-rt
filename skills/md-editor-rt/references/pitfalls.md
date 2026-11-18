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

- [15. 代码语言不存在时预览变慢](#15-代码语言不存在时预览变慢)
- [16. 自定义菜单或弹窗无法用键盘操作](#16-自定义菜单或弹窗无法用键盘操作)
- [17. 复制了旧 iconfont 配置](#17-复制了旧-iconfont-配置)

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

7.x 默认关闭原生 HTML，Mermaid 使用 `strict`，KaTeX 使用 `trust: false`。ECharts 的 JSON5 解析与 `sanitizeOption` 独立执行。`sanitize` 和 `sanitizeMermaid` 默认透传，不应误认为它们默认提供额外清洗。

启用 HTML 后，根据内容来源通过 `sanitize` 或 `XSSPlugin` 增加应用过滤规则；`XSSPlugin` 仅处理 HTML token，不能代替图表本身的配置。只需要自定义 ECharts 解析时，保留渲染策略。

## 9. 忽略外链副作用

症状：

- 路由切换后页面里残留 script / link
- 微前端场景下资源重复注入

处理：

- 正式业务优先本地实例注入
- 确认使用共享 CDN 资源的所有实例都已卸载，再由宿主调用 `clearSideEffects()`

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

## 15. 代码语言不存在时预览变慢

当前源码中，已注册语言使用指定语法高亮，没有语言标签的代码块才走自动探测；显式写了未注册语言时输出转义后的纯文本。此修复可能尚未出现在业务已安装的版本中。

- 使用 `highlight.js/lib/core` 时先注册业务需要的语言，再将实例传给 `config()`。
- 不要用 `autoDetectCode` 控制预览高亮：它用于识别粘贴到编辑区的代码。
- 排查旧版本的长代码块卡顿时，可临时设置 `noHighlight`；不要通过删除未知语言标签触发全语法自动探测。
- 自定义 `markdownItConfig` 中的 `highlight` 时，返回结果会优先使用，需单独检查该实现。

## 16. 自定义菜单或弹窗无法用键盘操作

当前源码为下拉与弹窗提供焦点管理。先检查安装包是否包含相应修复，再检查业务自定义内容：

- 下拉菜单将 `visible` 和 `onChange` 配套传入；菜单项用原生按钮和 `role="menuitem"`，保留文字或可访问名称。
- 菜单模式支持方向键、Home/End、Enter/Space、Escape；普通表单下拉保留原生输入行为，不把表单节点标记为菜单项。
- 弹窗通过 `visible`、打开回调和 `onClose` 管理状态，提供有意义的标题和可聚焦操作。不要另加全局按键监听与内置焦点归还冲突。
- `title` / `modalTitle` 用于组件已有的名称入口；不要往库的语言包中添加不存在的字段。

## 17. 复制了旧 iconfont 配置

7.x 使用内置 SVG 图标，不再使用 `config({ iconfontType: ... })`。移除旧 iconfont 脚本、CSS 和字体；需要替换图标时查当前安装包的 `customIcon` 类型。
