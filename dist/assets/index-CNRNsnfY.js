import{u as l,r as e,j as n,I as h,f as p}from"./index-CHHuzJJQ.js";const r=`## 🐶 Heading

\`\`\`markdown
## Heading
\`\`\`

---

## 🐱 Bold

**I have a dream that one day this nation will rise up.**

\`\`\`markdown
**I have a dream that one day this nation will rise up.**
\`\`\`

---

## 🐭 Italic

_It is a dream deeply rooted in the American dream._

\`\`\`markdown
_It is a dream deeply rooted in the American dream._
\`\`\`

---

## 🐹 Strikethrough

~~It is a dream deeply rooted in the American dream.~~

\`\`\`markdown
~~It is a dream deeply rooted in the American dream.~~
\`\`\`

---

## 🐻 Link

[md-editor-rt](https://imzbf.github.io/md-editor-rt/)

\`\`\`markdown
[md-editor-rt](https://imzbf.github.io/md-editor-rt/)
\`\`\`

---

## 🐼 Picture

![Description](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')

\`\`\`markdown
![Description](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')
\`\`\`

---

## 🙉 Underline

<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>

\`\`\`markdown
<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>
\`\`\`

---

## 🙊 Superscript

I have a dream that one day this nation will rise up.<sup>[1]</sup>

\`\`\`markdown
I have a dream that one day this nation will rise up.<sup>[1]</sup>
\`\`\`

---

## 🐒 Subscript

I have a dream that one day this nation will rise up.<sub>[2]</sub>

\`\`\`markdown
I have a dream that one day this nation will rise up.<sub>[2]</sub>
\`\`\`

---

## 🐰 Inline Code

\`md-editor-rt\`

\`\`\`markdown
\`md-editor-rt\`
\`\`\`

---

## 🦊 Block Code

\`\`\`\`markdown
\`\`\`js
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

### 🗄 Combination

\`\`\`shell [id:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [id:npm]
npm install md-editor-rt
\`\`\`

\`\`\`shell [id:pnpm]
pnpm install md-editor-rt
\`\`\`

\`\`\`\`markdown
\`\`\`shell [id:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [id:npm]
npm install md-editor-rt
\`\`\`

\`\`\`shell [id:pnpm]
pnpm install md-editor-rt
\`\`\`
\`\`\`\`

### 🤌🏻 Forcefully fold

\`\`\`js ::close
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`

\`\`\`\`markdown
\`\`\`js ::close
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

### 👐 Forcefully open

\`\`\`js ::open
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`

\`\`\`\`markdown
\`\`\`js ::open
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

According to the understanding of other editors, no other editors currently employ a similar syntax. Exercise caution when using this syntax if you intend to copy your content for display in other editors.

---

## 🐻‍❄️ Quote

> Quote: I Have a Dream

\`\`\`markdown
> Quote: I Have a Dream
\`\`\`

---

## 🐨 Ordered List

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

\`\`\`markdown
1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.
\`\`\`

---

## 🐯 Unordered List

- So even though we face the difficulties of today and tomorrow, I still have a dream.
- It is a dream deeply rooted in the American dream.
- I have a dream that one day this nation will rise up.

\`\`\`markdown
- So even though we face the difficulties of today and tomorrow, I still have a dream.
- It is a dream deeply rooted in the American dream.
- I have a dream that one day this nation will rise up.
\`\`\`

---

## 🦁 Task List

- [ ] Friday
- [ ] Saturday
- [x] Sunday

\`\`\`markdown
- [ ] Friday
- [ ] Saturday
- [x] Sunday
\`\`\`

[Example](https://imzbf.github.io/md-editor-rt/en-US/demo#☑%EF%B8%8F%20Toggleable%20status%20task%20list) that supports toggling task status in the preview module.

---

## 🐮 Table

| THead1          |      THead2       |           THead3 | THead4  |
| :-------------- | :---------------: | ---------------: | ------- |
| text-align:left | text-align:center | text-align:right | default |

\`\`\`markdown
| THead1          |      THead2       |           THead3 | THead4  |
| :-------------- | :---------------: | ---------------: | ------- |
| text-align:left | text-align:center | text-align:right | default |
\`\`\`

---

## 🐷 Mathematical Formula

Two modes.

### 🐽 Inline

$x+y^{2x}$ \\(\\xrightarrow[under]{over}\\)

\`\`\`markdown
$x+y^{2x}$

<!-- or -->

\\(\\xrightarrow[under]{over}\\)
\`\`\`

---

### 🐸 Block

$$\\sqrt[3]{x}$$

\\[\\xrightarrow[under]{over}\\]

\`\`\`markdown
$$
\\sqrt[3]{x}
$$

<!-- or -->

\\[\\xrightarrow[under]{over}\\]
\`\`\`

For more usage: [https://katex.org/docs/supported.html](https://katex.org/docs/supported.html)

---

## 🐵 Diagram

\`\`\`mermaid
---
title: Example Git diagram
---
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\`

\`\`\`\`markdown
\`\`\`mermaid
---
title: Example Git diagram
---
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\`
\`\`\`\`

For more usage: [https://mermaid.js.org/syntax/flowchart.html](https://mermaid.js.org/syntax/flowchart.html)

---

## 🙈 Alert

!!! note Supported Types

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

\`\`\`markdown
!!! note Supported Types

note、abstract、info、tip、success、question、warning

failure、danger、bug、example、quote、hint、caution、error、attention

!!!
\`\`\`
`,o=`## 🐶 标题

\`\`\`markdown
## 标题
\`\`\`

---

## 🐱 加粗

**I have a dream that one day this nation will rise up.**

\`\`\`markdown
**I have a dream that one day this nation will rise up.**
\`\`\`

---

## 🐭 斜体

_It is a dream deeply rooted in the American dream._

\`\`\`markdown
_It is a dream deeply rooted in the American dream._
\`\`\`

---

## 🐹 删除线

~~It is a dream deeply rooted in the American dream.~~

\`\`\`markdown
~~It is a dream deeply rooted in the American dream.~~
\`\`\`

---

## 🐻 超链接

[md-editor-rt](https://imzbf.github.io/md-editor-rt/)

\`\`\`markdown
[md-editor-rt](https://imzbf.github.io/md-editor-rt/)
\`\`\`

---

## 🐼 图片

![描述文字](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')

\`\`\`markdown
![描述文字](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')
\`\`\`

---

## 🙉 下划线

<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>

\`\`\`markdown
<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>
\`\`\`

---

## 🙊 上标

I have a dream that one day this nation will rise up.<sup>[1]</sup>

\`\`\`markdown
I have a dream that one day this nation will rise up.<sup>[1]</sup>
\`\`\`

---

## 🐒 下标

I have a dream that one day this nation will rise up.<sub>[2]</sub>

\`\`\`markdown
I have a dream that one day this nation will rise up.<sub>[2]</sub>
\`\`\`

---

## 🐰 行内代码

\`md-editor-rt\`

\`\`\`markdown
\`md-editor-rt\`
\`\`\`

---

## 🦊 块级代码

\`\`\`\`markdown
\`\`\`js
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

### 🗄 代码组合

\`\`\`shell [id:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [id:npm]
npm install md-editor-rt
\`\`\`

\`\`\`shell [id:pnpm]
pnpm install md-editor-rt
\`\`\`

\`\`\`\`markdown
\`\`\`shell [id:yarn]
yarn add md-editor-rt
\`\`\`

\`\`\`shell [id:npm]
npm install md-editor-rt
\`\`\`

\`\`\`shell [id:pnpm]
pnpm install md-editor-rt
\`\`\`
\`\`\`\`

### 🤌🏻 强制折叠

\`\`\`js ::close
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`

\`\`\`\`markdown
\`\`\`js ::close
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

### 👐 强制展开

\`\`\`js ::open
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`

\`\`\`\`markdown
\`\`\`js ::open
import MdEditor from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';
\`\`\`
\`\`\`\`

据其他编辑器的了解，目前没有其他编辑器使用类似的语法，如果需要拷贝你的内容到其他编辑器展示时，请谨慎使用该语法。

---

## 🐻‍❄️ 引用

> 引用：《I Have a Dream》

\`\`\`markdown
> 引用：《I Have a Dream》
\`\`\`

---

## 🐨 有序列表

1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.

\`\`\`markdown
1. So even though we face the difficulties of today and tomorrow, I still have a dream.
2. It is a dream deeply rooted in the American dream.
3. I have a dream that one day this nation will rise up.
\`\`\`

---

## 🐯 无序列表

- So even though we face the difficulties of today and tomorrow, I still have a dream.
- It is a dream deeply rooted in the American dream.
- I have a dream that one day this nation will rise up.

\`\`\`markdown
- So even though we face the difficulties of today and tomorrow, I still have a dream.
- It is a dream deeply rooted in the American dream.
- I have a dream that one day this nation will rise up.
\`\`\`

---

## 🦁 任务列表

- [ ] 周五
- [ ] 周六
- [x] 周天

\`\`\`markdown
- [ ] 周五
- [ ] 周六
- [x] 周天
\`\`\`

支持在预览模块切换任务状态的[示例](https://imzbf.github.io/md-editor-rt/zh-CN/demo#☑%EF%B8%8F%20可切换状态的任务列表)

---

## 🐮 表格

| 表头1  |  表头2   |  表头3 | 表头4 |
| :----- | :------: | -----: | ----- |
| 左对齐 | 中间对齐 | 右对齐 | 默认  |

\`\`\`markdown
| 表头1  |  表头2   |  表头3 | 表头4 |
| :----- | :------: | -----: | ----- |
| 左对齐 | 中间对齐 | 右对齐 | 默认  |
\`\`\`

---

## 🐷 数学公式

有两种模式

### 🐽 行内

$x+y^{2x}$ \\(\\xrightarrow[under]{over}\\)

\`\`\`markdown
$x+y^{2x}$

<!-- or -->

\\(\\xrightarrow[under]{over}\\)
\`\`\`

---

### 🐸 块级

$$\\sqrt[3]{x}$$

\\[\\xrightarrow[under]{over}\\]

\`\`\`markdown
$$
\\sqrt[3]{x}
$$

<!-- or -->

\\[\\xrightarrow[under]{over}\\]
\`\`\`

更多公式示例参考：[https://katex.org/docs/supported.html](https://katex.org/docs/supported.html)

---

## 🐵 图表

\`\`\`mermaid
---
title: Example Git diagram
---
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\`

\`\`\`\`markdown
\`\`\`mermaid
---
title: Example Git diagram
---
gitGraph
   commit
   commit
   branch develop
   checkout develop
   commit
   commit
   checkout main
   merge develop
   commit
   commit
\`\`\`
\`\`\`\`

更多图形示例参考：[https://mermaid.js.org/syntax/flowchart.html](https://mermaid.js.org/syntax/flowchart.html)

---

## 🙈 提示

!!! note 支持的类型

note、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention

!!!

\`\`\`markdown
!!! note 支持的类型

note、abstract、info、tip、success、question、warning

failure、danger、bug、example、quote、hint、caution、error、attention

!!!
\`\`\`
`,a="grammar-preview",c=()=>{const t=l(s=>s),[i,d]=e.useState(()=>t.lang==="zh-CN"?o:r),m=()=>{d(t.lang==="en-US"?r:o)};return e.useEffect(m,[t.lang]),n.jsx("div",{className:"container",children:n.jsxs("div",{className:"doc",children:[n.jsx(h,{editorId:a,modelValue:i,showCodeRowNumber:!1}),n.jsx(p,{editorId:a})]})})};export{c as default};
