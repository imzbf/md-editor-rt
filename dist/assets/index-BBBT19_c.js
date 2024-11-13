import{u as h,r as e,j as i,I as a}from"./index-CHHuzJJQ.js";const s=`## About md-editor-rt

![](https://img.shields.io/github/stars/imzbf/md-editor-rt?style=social) ![](https://img.shields.io/npm/dm/md-editor-rt) ![](https://img.shields.io/bundlephobia/min/md-editor-rt) ![](https://img.shields.io/github/license/imzbf/md-editor-rt) ![](https://img.shields.io/github/package-json/v/imzbf/md-editor-rt) ![](https://img.shields.io/badge/ssr-%3E1.6.0-brightgreen)

Markdown editor for react, developed in jsx and typescript, dark theme, beautify content by prettier, render articles directly, paste or clip the picture and upload it...

## Same Series

- For vue3, [md-editor-v3](https://github.com/imzbf/md-editor-v3)

## Connect

1. Email：zbfcqtl@gmail.com
2. Github issue：[github issues](https://github.com/imzbf/md-editor-rt/issues)

I'm not proficient in English, please help me correct wrong grammars.
`,r=`## 关于 md-editor-rt

![](https://img.shields.io/github/stars/imzbf/md-editor-rt?style=social) ![](https://img.shields.io/npm/dm/md-editor-rt) ![](https://img.shields.io/bundlephobia/min/md-editor-rt) ![](https://img.shields.io/github/license/imzbf/md-editor-rt) ![](https://img.shields.io/github/package-json/v/imzbf/md-editor-rt) ![](https://img.shields.io/badge/ssr-%3E1.6.0-brightgreen)

Markdown 编辑器，react 版本，使用 jsx 和 typescript 语法开发，支持切换主题，支持 prettier 美化文本，支持图片粘贴上传，裁剪上传，支持在 tsx 项目使用。

## 同系列

- vue3 版本，[md-editor-v3](https://github.com/imzbf/md-editor-v3)

## 反馈联系

1. 邮箱：zbfcqtl@gmail.com
2. issue 管理：[github issues](https://github.com/imzbf/md-editor-rt/issues)
`,c=()=>{const t=h(m=>m),[d,n]=e.useState(()=>t.lang==="zh-CN"?r:s),o=()=>{n(t.lang==="en-US"?s:r)};return e.useEffect(o,[t.lang]),i.jsx("div",{className:"container",children:i.jsx("div",{className:"doc",children:i.jsx(a,{editorId:"md-about",modelValue:d})})})};export{c as default};
