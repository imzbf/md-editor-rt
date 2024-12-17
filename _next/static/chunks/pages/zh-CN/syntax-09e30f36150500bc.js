(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5619],{2558:(n,e,t)=>{(window.__NEXT_P=window.__NEXT_P||[]).push(["/zh-CN/syntax",function(){return t(6479)}])},8232:(n,e,t)=>{"use strict";t.d(e,{Z:()=>c});var r=t(5893),o=t(1154),i=t(2999),a=t(8570),d=t(7294),m=t(5217),s=t(1237);let l=(n,e)=>{history.replaceState({},"","".concat(location.pathname,"#").concat(e.text))},h=n=>{let e=(0,i.C)(n=>n.setting),t=(0,d.useRef)(null),o=(0,d.useRef)(!0),a=(0,d.useCallback)((n,e)=>{if(!e||!o.current)return;let r=(0,s.qA)(),i=e.offsetTop-t.current.scrollTop;i>200?r(t.current,e.offsetTop-200):i<100&&r(t.current,e.offsetTop-100)},[]);return(0,r.jsx)("div",{className:"catalog",onMouseEnter:()=>{o.current=!1},onMouseLeave:()=>{o.current=!0},children:(0,r.jsx)("div",{ref:t,className:"affix",children:(0,r.jsx)(m.M,{scrollElementOffsetTop:10,editorId:n.editorId,theme:e.theme,scrollElement:"html",onClick:l,onActive:a})})})},c=n=>{let{showCodeRowNumber:e=!0}=n,t=(0,a.J)(),d=(0,i.C)(n=>n.setting);return(0,r.jsx)("div",{className:"container",children:(0,r.jsxs)("div",{className:"doc",children:[(0,r.jsx)("div",{className:"content",children:(0,r.jsx)(o.Z,{id:n.editorId,language:t,theme:d.theme,value:n.value,previewTheme:d.previewTheme,showCodeRowNumber:e,codeTheme:d.codeTheme})}),(0,r.jsx)(h,{editorId:n.editorId})]})})}},6479:(n,e,t)=>{"use strict";t.r(e),t.d(e,{default:()=>m});var r=t(5893),o=t(9008),i=t.n(o),a=t(7348),d=t(8232);function m(){return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)(i(),{children:[(0,r.jsx)("title",{children:"语法 - ".concat(a.xC)}),(0,r.jsx)("meta",{name:"keywords",content:a.hL}),(0,r.jsx)("meta",{name:"description",content:a.VL}),(0,r.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1"})]}),(0,r.jsx)(d.Z,{editorId:"md-syntax-zh",value:"## \uD83D\uDC36 标题\n\n```markdown\n## 标题\n```\n\n---\n\n## \uD83D\uDC31 加粗\n\n**I have a dream that one day this nation will rise up.**\n\n```markdown\n**I have a dream that one day this nation will rise up.**\n```\n\n---\n\n## \uD83D\uDC2D 斜体\n\n_It is a dream deeply rooted in the American dream._\n\n```markdown\n_It is a dream deeply rooted in the American dream._\n```\n\n---\n\n## \uD83D\uDC39 删除线\n\n~~It is a dream deeply rooted in the American dream.~~\n\n```markdown\n~~It is a dream deeply rooted in the American dream.~~\n```\n\n---\n\n## \uD83D\uDC3B 超链接\n\n[md-editor-rt](https://imzbf.github.io/md-editor-rt/)\n\n```markdown\n[md-editor-rt](https://imzbf.github.io/md-editor-rt/)\n```\n\n---\n\n## \uD83D\uDC3C 图片\n\n![描述文字](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')\n\n```markdown\n![描述文字](https://imzbf.github.io/md-editor-rt/imgs/mark_emoji.gif 'title')\n```\n\n---\n\n## \uD83D\uDE49 下划线\n\n<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>\n\n```markdown\n<u>So even though we face the difficulties of today and tomorrow, I still have a dream.</u>\n```\n\n---\n\n## \uD83D\uDE4A 上标\n\nI have a dream that one day this nation will rise up.^[1]^\n\n```markdown\nI have a dream that one day this nation will rise up.^[1]^\n```\n\n---\n\n## \uD83D\uDC12 下标\n\nI have a dream that one day this nation will rise up.~[2]~\n\n```markdown\nI have a dream that one day this nation will rise up.~[2]~\n```\n\n---\n\n## \uD83D\uDC30 行内代码\n\n`md-editor-rt`\n\n```markdown\n`md-editor-rt`\n```\n\n---\n\n## \uD83E\uDD8A 块级代码\n\n````markdown\n```js\nimport MdEditor from 'md-editor-rt';\nimport 'md-editor-rt/lib/style.css';\n```\n````\n\n### \uD83D\uDDC4 代码组合\n\n```shell [id:yarn]\nyarn add md-editor-rt\n```\n\n```shell [id:npm]\nnpm install md-editor-rt\n```\n\n```shell [id:pnpm]\npnpm install md-editor-rt\n```\n\n````markdown\n```shell [id:yarn]\nyarn add md-editor-rt\n```\n\n```shell [id:npm]\nnpm install md-editor-rt\n```\n\n```shell [id:pnpm]\npnpm install md-editor-rt\n```\n````\n\n### \uD83E\uDD0C\uD83C\uDFFB 强制折叠\n\n```js ::close\nimport MdEditor from 'md-editor-rt';\nimport 'md-editor-rt/lib/style.css';\n```\n\n````markdown\n```js ::close\nimport MdEditor from 'md-editor-rt';\nimport 'md-editor-rt/lib/style.css';\n```\n````\n\n### \uD83D\uDC50 强制展开\n\n```js ::open\nimport MdEditor from 'md-editor-rt';\nimport 'md-editor-rt/lib/style.css';\n```\n\n````markdown\n```js ::open\nimport MdEditor from 'md-editor-rt';\nimport 'md-editor-rt/lib/style.css';\n```\n````\n\n据其他编辑器的了解，目前没有其他编辑器使用类似的语法，如果需要拷贝你的内容到其他编辑器展示时，请谨慎使用该语法。\n\n---\n\n## \uD83D\uDC3B‍❄️ 引用\n\n> 引用：《I Have a Dream》\n\n```markdown\n> 引用：《I Have a Dream》\n```\n\n---\n\n## \uD83D\uDC28 有序列表\n\n1. So even though we face the difficulties of today and tomorrow, I still have a dream.\n2. It is a dream deeply rooted in the American dream.\n3. I have a dream that one day this nation will rise up.\n\n```markdown\n1. So even though we face the difficulties of today and tomorrow, I still have a dream.\n2. It is a dream deeply rooted in the American dream.\n3. I have a dream that one day this nation will rise up.\n```\n\n---\n\n## \uD83D\uDC2F 无序列表\n\n- So even though we face the difficulties of today and tomorrow, I still have a dream.\n- It is a dream deeply rooted in the American dream.\n- I have a dream that one day this nation will rise up.\n\n```markdown\n- So even though we face the difficulties of today and tomorrow, I still have a dream.\n- It is a dream deeply rooted in the American dream.\n- I have a dream that one day this nation will rise up.\n```\n\n---\n\n## \uD83E\uDD81 任务列表\n\n- [ ] 周五\n- [ ] 周六\n- [x] 周天\n\n```markdown\n- [ ] 周五\n- [ ] 周六\n- [x] 周天\n```\n\n支持在预览模块切换任务状态的[示例](https://imzbf.github.io/md-editor-rt/zh-CN/demo#☑%EF%B8%8F%20可切换状态的任务列表)\n\n---\n\n## \uD83D\uDC2E 表格\n\n| 表头1  |  表头2   |  表头3 | 表头4 |\n| :----- | :------: | -----: | ----- |\n| 左对齐 | 中间对齐 | 右对齐 | 默认  |\n\n```markdown\n| 表头1  |  表头2   |  表头3 | 表头4 |\n| :----- | :------: | -----: | ----- |\n| 左对齐 | 中间对齐 | 右对齐 | 默认  |\n```\n\n---\n\n## \uD83D\uDC37 数学公式\n\n有两种模式\n\n### \uD83D\uDC3D 行内\n\n$x+y^{2x}$ \\(\\xrightarrow[under]{over}\\)\n\n```markdown\n$x+y^{2x}$\n\n<!-- or -->\n\n\\(\\xrightarrow[under]{over}\\)\n```\n\n---\n\n### \uD83D\uDC38 块级\n\n$$\\sqrt[3]{x}$$\n\n\\[\\xrightarrow[under]{over}\\]\n\n```markdown\n$$\n\\sqrt[3]{x}\n$$\n\n<!-- or -->\n\n\\[\\xrightarrow[under]{over}\\]\n```\n\n更多公式示例参考：[https://katex.org/docs/supported.html](https://katex.org/docs/supported.html)\n\n---\n\n## \uD83D\uDC35 图表\n\n```mermaid\n---\ntitle: Example Git diagram\n---\ngitGraph\n   commit\n   commit\n   branch develop\n   checkout develop\n   commit\n   commit\n   checkout main\n   merge develop\n   commit\n   commit\n```\n\n````markdown\n```mermaid\n---\ntitle: Example Git diagram\n---\ngitGraph\n   commit\n   commit\n   branch develop\n   checkout develop\n   commit\n   commit\n   checkout main\n   merge develop\n   commit\n   commit\n```\n````\n\n更多图形示例参考：[https://mermaid.js.org/syntax/flowchart.html](https://mermaid.js.org/syntax/flowchart.html)\n\n---\n\n## \uD83D\uDE48 提示\n\n!!! note 支持的类型\n\nnote、abstract、info、tip、success、question、warning、failure、danger、bug、example、quote、hint、caution、error、attention\n\n!!!\n\n```markdown\n!!! note 支持的类型\n\nnote、abstract、info、tip、success、question、warning\n\nfailure、danger、bug、example、quote、hint、caution、error、attention\n\n!!!\n```\n"})]})}}},n=>{var e=e=>n(n.s=e);n.O(0,[1581,2888,9774,179],()=>e(2558)),_N_E=n.O()}]);