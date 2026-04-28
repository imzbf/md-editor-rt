# md-editor-rt 功能依赖矩阵

> 用这份矩阵判断某个功能是否会走默认外部资源，以及什么时候建议改成业务本地实例。

## 目录

- [1. 总体原则](#1-总体原则)
- [2. 依赖矩阵](#2-依赖矩阵)
- [3. 推荐决策顺序](#3-推荐决策顺序)

## 1. 总体原则

优先按下面的顺序决策：

1. 先确认用户是否真的需要该功能。
2. 再确认业务环境是否允许运行时插入外部资源。
3. 如果有严格 CSP、离线环境、Electron、内网部署或微前端约束，优先本地安装依赖并通过 `config()` 注入实例。
4. 如果只是快速演示或普通页面，默认行为通常可接受。

## 2. 依赖矩阵

| 功能 | 相关配置 | 默认行为 | 何时建议本地注入实例 | 备注 |
| --- | --- | --- | --- | --- |
| 代码高亮 | `editorExtensions.highlight` | 可走默认外链 | 有 CSP、主题统一要求、离线环境时 | 常需要同时处理高亮 CSS |
| Markdown 格式化 | `editorExtensions.prettier` | 可走默认外链 | 希望稳定版本、避免外链时 | 需同时提供 `prettierInstance` 和 `parserMarkdownInstance` |
| 图片裁剪上传 | `editorExtensions.cropper` | 上传链路可能触发外链资源 | 上传体验重要、不能走外链时 | 若完全禁用上传可用 `noUploadImg` |
| 浏览器全屏 | `editorExtensions.screenfull` | 可走默认外链 | Electron、CSP 或版本锁定时 | 只影响屏幕全屏能力 |
| Mermaid | `editorExtensions.mermaid` | 可走默认外链 | 图表稳定性要求高或无法访问外链时 | 还要评估 `sanitizeMermaid` |
| KaTeX | `editorExtensions.katex` | 可走默认外链 | 数学公式是核心能力或需要离线时 | 通常还要同步引入 CSS |
| ECharts | `editorExtensions.echarts` | 可走默认外链；`6.5.x` 默认用 `new Function` 解析代码块 | 图表页面、内网、CSP 或不可信内容时 | 可用 `noEcharts` 关闭；`>=6.5.0` 可用 `parseOption` 改成 `JSON.parse` |

## 3. 推荐决策顺序

- 做 PoC 或演示：先用默认行为。
- 做正式业务接入：优先评估是否要本地实例替代外链。
- 做 Next / Electron / 内网 / 微前端：默认倾向本地实例。
- 做安全要求较高的产品：同时评估外链、XSS 和 HTML 清洗，不要只改其中一个。

补充提醒：

- `highlight.js`、`katex`、`cropperjs` 这类能力除了 JS 实例外，往往还需要同步引入对应 CSS。
- ECharts 代码块如果来自不可信内容，`>=6.5.0` 优先通过 `editorExtensions.echarts.parseOption` 替换默认解析器；未来 `7.0` 计划默认改为 `JSON.parse`。
- `MdPreview` 一样可能触发高亮、Mermaid、KaTeX、ECharts 相关能力，不要只在 `MdEditor` 场景考虑依赖。
- 如果业务已经自行管理代码高亮或公式样式，应先确认是否还需要保留 md-editor-rt 默认链路。
