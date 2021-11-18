import{r as a,u as E,R as n}from"./vendor.cdc065db.js";import{E as l,a as C}from"./md-editor-rt.es.a2ba9662.js";const c=`## 1. md-editor-rt

Markdown \u7F16\u8F91\u5668\uFF0C\u57FA\u4E8E react\uFF0C\u4F7F\u7528 jsx \u548C typescript \u8BED\u6CD5\u5F00\u53D1\uFF0C\u652F\u6301\u5207\u6362\u4E3B\u9898\u3001prettier \u7F8E\u5316\u6587\u672C\u7B49\u3002

### 1.1 \u57FA\u672C\u6F14\u793A

**\u52A0\u7C97**\uFF0C<u>\u4E0B\u5212\u7EBF</u>\uFF0C_\u659C\u4F53_\uFF0C~\u5220\u9664\u7EBF~\uFF0C\u4E0A\u6807<sup>26</sup>\uFF0C\u4E0B\u6807<sub>[1]</sub>\uFF0C\`inline code\`\uFF0C[\u8D85\u94FE\u63A5](https://imbf.cc)

> \u5F15\u7528\uFF1A\u4E16\u754C\u4E0A\u6CA1\u6709\u7EDD\u5BF9\uFF0C\u53EA\u6709\u76F8\u5BF9

## 2. \u4EE3\u7801\u6F14\u793A

\`\`\`js
import { defineComponent, ref } from "vue";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";


export default defineComponent({
  name: "MdEditor",
  setup() {
    const text = ref("");
    return () => (
      <MdEditor modelValue={text.value} onChange={(v: string) => (text.value = v)} />
    );
  }
});
\`\`\`


## 3. \u6587\u672C\u6F14\u793A


\u4F9D\u7167\u666E\u6717\u514B\u957F\u5EA6\u8FD9\u9879\u5355\u4F4D\uFF0C\u76EE\u524D\u53EF\u89C2\u6D4B\u7684\u5B87\u5B99\u7684\u76F4\u5F84\u4F30\u8BA1\u503C\uFF08\u76F4\u5F84\u7EA6 930 \u4EBF\u5149\u5E74\uFF0C\u5373 8.8 \xD7 10<sup>26</sup> \u7C73\uFF09\u5373\u4E3A 5.4 \xD7 10<sup>61</sup>\u500D\u666E\u6717\u514B\u957F\u5EA6\u3002\u800C\u53EF\u89C2\u6D4B\u5B87\u5B99\u4F53\u79EF\u5219\u4E3A 8.4 \xD7 10<sup>184</sup>\u7ACB\u65B9\u666E\u6717\u514B\u957F\u5EA6\uFF08\u666E\u6717\u514B\u4F53\u79EF\uFF09\u3002


## 4. \u8868\u683C\u6F14\u793A


| \u6635\u79F0 | \u733F\u9F84\uFF08\u5E74\uFF09 | \u6765\u81EA      |
| ---- | ---------- | --------- |
| \u4E4B\u95F4 | 3          | \u4E2D\u56FD-\u91CD\u5E86 |


## 5. \u5360\u4E2A\u5751@\uFF01
`,f=`## 1. md-editor-rt

Markdown Editor for Vue3, developed by jsx and typescript, support different themes\u3001beautify content by prettier.

### 1.1 Base

**bold**, <u>underline</u>, _italic_, ~line-through~, superscript<sup>26</sup>\uFF0Csubscript<sub>[1]</sub>\uFF0C\`inline code\`\uFF0C[link](https://imbf.cc)

> quote\uFF1Ahahaha

## 2. Demo

\`\`\`js
import { defineComponent, ref } from "vue";
import MdEditor from "md-editor-rt";
import "md-editor-rt/lib/style.css";


export default defineComponent({
  name: "MdEditor",
  setup() {
    const text = ref("");
    return () => (
      <MdEditor modelValue={text.value} onChange={(v: string) => (text.value = v)} />
    );
  }
});
\`\`\`


## 3. Text


The Old Man and the Sea served to reinvigorate Hemingway's literary reputation and prompted a reexamination of his entire body of work.


## 4. Table


| nickname | age | from      |
| ---- | ---------- | --------- |
| zhijian | 3          | China ChongQing |


## 5. em... 
`;var B=()=>{const[i,t]=a.exports.useState(""),u=E(e=>e);return a.exports.useEffect(()=>{u.lang==="zh-CN"?t(c):t(f)},[u.lang]),n.createElement("div",{className:"project-preview"},n.createElement("div",{className:"container"},n.createElement(l,{theme:u.theme,previewTheme:u.previewTheme,modelValue:i,editorId:"md-editor-preview",onChange:e=>t(e),onUploadImg:async(e,s)=>{const d=await Promise.all(Array.from(e).map(r=>new Promise((m,p)=>{const F=new FormData;F.append("file",r),C.post("/api/img/upload",F,{headers:{"Content-Type":"multipart/form-data"}}).then(o=>m(o)).catch(o=>p(o))})));s(d.map(r=>r.data.url))}}),n.createElement("br",null),n.createElement("span",{className:"tips-text"},u.lang==="zh-CN"?"Tips\uFF1A\u672C\u9875\u5C55\u793A\u7F16\u8F91\u5668localstorage\u5B58\u50A8\u529F\u80FD\u5DF2\u79FB\u9664\uFF01":"Tips: The editor in this page can not save text to localstorage now!")))};export{B as default};
