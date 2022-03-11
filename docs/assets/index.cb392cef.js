import{r as d,u as f,R as u}from"./vendor.f3e2b906.js";import{E as c,a as x}from"./md-editor-rt.es.b9678932.js";const h=`## \u{1F632} md-editor-rt

Markdown \u7F16\u8F91\u5668\uFF0C\u57FA\u4E8E react\uFF0C\u4F7F\u7528 jsx \u548C typescript \u8BED\u6CD5\u5F00\u53D1\uFF0C\u652F\u6301\u5207\u6362\u4E3B\u9898\u3001prettier \u7F8E\u5316\u6587\u672C\u7B49\u3002

### \u{1F916} \u57FA\u672C\u6F14\u793A

**\u52A0\u7C97**\uFF0C<u>\u4E0B\u5212\u7EBF</u>\uFF0C_\u659C\u4F53_\uFF0C~\u5220\u9664\u7EBF~\uFF0C\u4E0A\u6807<sup>26</sup>\uFF0C\u4E0B\u6807<sub>[1]</sub>\uFF0C\`inline code\`\uFF0C[\u8D85\u94FE\u63A5](https://imbf.cc)

> \u5F15\u7528\uFF1A\u4E16\u754C\u4E0A\u6CA1\u6709\u7EDD\u5BF9\uFF0C\u53EA\u6709\u76F8\u5BF9

## \u{1F917} \u4EE3\u7801\u6F14\u793A

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


## \u{1F5A8} \u6587\u672C\u6F14\u793A


\u4F9D\u7167\u666E\u6717\u514B\u957F\u5EA6\u8FD9\u9879\u5355\u4F4D\uFF0C\u76EE\u524D\u53EF\u89C2\u6D4B\u7684\u5B87\u5B99\u7684\u76F4\u5F84\u4F30\u8BA1\u503C\uFF08\u76F4\u5F84\u7EA6 930 \u4EBF\u5149\u5E74\uFF0C\u5373 8.8 \xD7 10<sup>26</sup> \u7C73\uFF09\u5373\u4E3A 5.4 \xD7 10<sup>61</sup>\u500D\u666E\u6717\u514B\u957F\u5EA6\u3002\u800C\u53EF\u89C2\u6D4B\u5B87\u5B99\u4F53\u79EF\u5219\u4E3A 8.4 \xD7 10<sup>184</sup>\u7ACB\u65B9\u666E\u6717\u514B\u957F\u5EA6\uFF08\u666E\u6717\u514B\u4F53\u79EF\uFF09\u3002


## \u{1F4C8} \u8868\u683C\u6F14\u793A


| \u6635\u79F0 | \u733F\u9F84\uFF08\u5E74\uFF09 | \u6765\u81EA      |
| ---- | ---------- | --------- |
| \u4E4B\u95F4 | 3          | \u4E2D\u56FD-\u91CD\u5E86 |


## \u{1F9EC} \u56FE\u8868

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

## \u2618\uFE0F \u5360\u4E2A\u5751@\uFF01
`,v=`## \u{1F632} md-editor-rt

Markdown Editor for Vue3, developed by jsx and typescript, support different themes\u3001beautify content by prettier.

### \u{1F916} Base

**bold**, <u>underline</u>, _italic_, ~line-through~, superscript<sup>26</sup>\uFF0Csubscript<sub>[1]</sub>\uFF0C\`inline code\`\uFF0C[link](https://imbf.cc)

> quote\uFF1Ahahaha

## \u{1F917} Demo

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


## \u{1F5A8} Text


The Old Man and the Sea served to reinvigorate Hemingway's literary reputation and prompted a reexamination of his entire body of work.


## \u{1F4C8} Table


| nickname | age | from      |
| ---- | ---------- | --------- |
| zhijian | 3          | China ChongQing |


## \u{1F9EC} Diagram

\`\`\`mermaid
flowchart TD
  Start --> Stop
\`\`\`

## \u2618\uFE0F em... 
`,B=["\u{1F600}","\u{1F603}","\u{1F604}","\u{1F601}","\u{1F606}","\u{1F605}","\u{1F602}","\u{1F923}","\u{1F972}","\u{1F914}","\u{1F60A}","\u{1F607}","\u{1F642}","\u{1F643}","\u{1F609}","\u{1F60C}","\u{1F60D}","\u{1F970}","\u{1F618}","\u{1F617}","\u{1F619}","\u{1F61A}","\u{1F60B}","\u{1F61B}","\u{1F61D}","\u{1F61C}","\u{1F92A}","\u{1F928}","\u{1F9D0}","\u{1F913}","\u{1F60E}","\u{1F978}","\u{1F929}","\u{1F973}","\u{1F60F}","\u{1F612}","\u{1F61E}","\u{1F614}","\u{1F61F}","\u{1F615}","\u{1F641}","\u{1F47B}","\u{1F623}","\u{1F616}","\u{1F62B}","\u{1F629}","\u{1F97A}","\u{1F622}","\u{1F62D}","\u{1F624}","\u{1F620}","\u{1F621}","\u{1F92C}","\u{1F92F}","\u{1F633}"];var A={name:"MarkExtension",level:"inline",start:i=>{var a;return(a=i.match(/@[^@]/))==null?void 0:a.index},tokenizer(i){const r=/^@([^@]*)@/.exec(i);if(r)return{type:"MarkExtension",raw:r[0],text:r[1].trim(),tokens:[]}},renderer(i){return`<mark>${i.text}</mark>`}};var k=()=>{const[i,a]=d.exports.useState(""),r=f(e=>e);d.exports.useEffect(()=>{r.lang==="zh-CN"?a(h):a(v)},[r.lang]);const[p,E]=d.exports.useState(!1),C=()=>{var F;const e=document.querySelector("#md-prev-textarea"),n=(F=window.getSelection())==null?void 0:F.toString(),o=e.selectionStart,t=`@${n}@`,s=e.value.substring(0,o),l=e.value.substring(o+((n==null?void 0:n.length)||0));a(`${s}${t}${l}`),setTimeout(()=>{e.setSelectionRange(o,t.length+o),e.focus()},0)},g=e=>{var F;const n=document.querySelector("#md-prev-textarea"),o=(F=window.getSelection())==null?void 0:F.toString(),t=n.selectionStart,s=n.value.substring(0,t),l=n.value.substring(t+((o==null?void 0:o.length)||0));a(`${s}${e}${l}`),setTimeout(()=>{n.setSelectionRange(t,t+1),n.focus()},0)};return u.createElement("div",{className:"project-preview"},u.createElement("div",{className:"container"},u.createElement(c,{theme:r.theme,previewTheme:r.previewTheme,modelValue:i,language:r.lang,editorId:"md-prev",defToolbars:[u.createElement(c.NormalToolbar,{title:"\u6807\u8BB0",trigger:u.createElement("svg",{className:"md-icon","aria-hidden":"true"},u.createElement("use",{xlinkHref:"#icon-mark"})),onClick:C,key:"mark-toolbar"}),u.createElement(c.DropdownToolbar,{visible:p,onChange:E,overlay:u.createElement(u.Fragment,null,u.createElement("div",{className:"emoji-container"},u.createElement("ol",{className:"emojis"},B.map((e,n)=>u.createElement("li",{key:`emoji-${n}`,onClick:()=>{g(e)}},e))))),trigger:u.createElement("svg",{className:"md-icon","aria-hidden":"true"},u.createElement("use",{xlinkHref:"#icon-emoji"})),key:"emoji-toolbar"})],extensions:[A],toolbars:["bold","underline","italic","strikeThrough","-","title","sub","sup","quote","unorderedList","orderedList","-","codeRow","code","link","image","table","mermaid","katex",0,1,"-","revoke","next","save","=","prettier","pageFullscreen","fullscreen","preview","htmlPreview","catalog","github"],onChange:e=>a(e),onUploadImg:async(e,n)=>{const o=await Promise.all(Array.from(e).map(t=>new Promise((s,l)=>{const F=new FormData;F.append("file",t),x.post("/api/img/upload",F,{headers:{"Content-Type":"multipart/form-data"}}).then(m=>s(m)).catch(m=>l(m))})));n(o.map(t=>t.data.url))}}),u.createElement("br",null),u.createElement("span",{className:"tips-text"},r.lang==="zh-CN"?"Tips\uFF1A\u672C\u9875\u5C55\u793A\u7F16\u8F91\u5668localstorage\u5B58\u50A8\u529F\u80FD\u5DF2\u79FB\u9664\uFF01\u672C\u9875\u9762\u7684emoji\u793A\u4F8B\u9700\u8981\u81EA\u884C\u6269\u5C55\uFF0C\u8BF7\u53C2\u8003\u793A\u4F8B\u9875\u9762\u4E2D\u7684\u5185\u5BB9\uFF01":'Tips: The editor in this page can not save text to localstorage now! The function of inserting emoji on this page needs to be developed by yourself! The example is on the "demo" page.')))};export{k as default};
