"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[7365],{7365:(e,t,n)=>{function r(e){for(var t={},n=0;n<e.length;++n)t[e[n]]=!0;return t}n.r(t),n.d(t,{r:()=>b});var a,i=["NULL","NA","Inf","NaN","NA_integer_","NA_real_","NA_complex_","NA_character_","TRUE","FALSE"],c=["list","quote","bquote","eval","return","call","parse","deparse"],l=["if","else","repeat","while","function","for","in","next","break"],u=r(i),o=r(c),f=r(l),s=r(["if","else","repeat","while","function","for"]),p=/[+\-*\/^<>=!&|~$:]/;function m(e,t){a=null;var n=e.next();if("#"==n)return e.skipToEnd(),"comment";if("0"==n&&e.eat("x"))return e.eatWhile(/[\da-f]/i),"number";if("."==n&&e.eat(/\d/))return e.match(/\d*(?:e[+\-]?\d+)?/),"number";if(/\d/.test(n))return e.match(/\d*(?:\.\d+)?(?:e[+\-]\d+)?L?/),"number";if("'"==n||'"'==n)return t.tokenize=function(e,t){if(e.eat("\\")){var r,a=e.next();return"x"==a?e.match(/^[a-f0-9]{2}/i):("u"==a||"U"==a)&&e.eat("{")&&e.skipTo("}")?e.next():"u"==a?e.match(/^[a-f0-9]{4}/i):"U"==a?e.match(/^[a-f0-9]{8}/i):/[0-7]/.test(a)&&e.match(/^[0-7]{1,2}/),"string.special"}for(;null!=(r=e.next());){if(r==n){t.tokenize=m;break}if("\\"==r){e.backUp(1);break}}return"string"},"string";if("`"==n)return e.match(/[^`]+`/),"string.special";if("."==n&&e.match(/.(?:[.]|\d+)/))return"keyword";else if(/[a-zA-Z\.]/.test(n)){e.eatWhile(/[\w\.]/);var r=e.current();return u.propertyIsEnumerable(r)?"atom":f.propertyIsEnumerable(r)?(s.propertyIsEnumerable(r)&&!e.match(/\s*if(\s+|$)/,!1)&&(a="block"),"keyword"):o.propertyIsEnumerable(r)?"builtin":"variable"}else if("%"==n)return e.skipTo("%")&&e.next(),"variableName.special";else if("<"==n&&e.eat("-")||"<"==n&&e.match("<-")||"-"==n&&e.match(/>>?/))return"operator";else if("="==n&&t.ctx.argList)return"operator";else if(p.test(n))return"$"==n||e.eatWhile(p),"operator";else if(!/[\(\){}\[\];]/.test(n))return null;else return(a=n,";"==n)?"punctuation":null}function d(e,t,n){e.ctx={type:t,indent:e.indent,flags:0,column:n.column(),prev:e.ctx}}function k(e,t){var n=e.ctx;e.ctx={type:n.type,indent:n.indent,flags:n.flags|t,column:n.column,prev:n.prev}}function x(e){e.indent=e.ctx.indent,e.ctx=e.ctx.prev}let b={name:"r",startState:function(e){return{tokenize:m,ctx:{type:"top",indent:-e,flags:2},indent:0,afterIdent:!1}},token:function(e,t){if(e.sol()&&((3&t.ctx.flags)==0&&(t.ctx.flags|=2),4&t.ctx.flags&&x(t),t.indent=e.indentation()),e.eatSpace())return null;var n=t.tokenize(e,t);return"comment"!=n&&(2&t.ctx.flags)==0&&k(t,1),(";"==a||"{"==a||"}"==a)&&"block"==t.ctx.type&&x(t),"{"==a?d(t,"}",e):"("==a?(d(t,")",e),t.afterIdent&&(t.ctx.argList=!0)):"["==a?d(t,"]",e):"block"==a?d(t,"block",e):a==t.ctx.type?x(t):"block"==t.ctx.type&&"comment"!=n&&k(t,4),t.afterIdent="variable"==n||"keyword"==n,n},indent:function(e,t,n){if(e.tokenize!=m)return 0;var r=t&&t.charAt(0),a=e.ctx,i=r==a.type;return(4&a.flags&&(a=a.prev),"block"==a.type)?a.indent+("{"==r?0:n.unit):1&a.flags?a.column+(i?0:1):a.indent+(i?0:n.unit)},languageData:{wordChars:".",commentTokens:{line:"#"},autocomplete:i.concat(c,l)}}}}]);