"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6732],{6732:(t,e,n)=>{function r(t){function e(t,e){t.cmdState.push(e)}function n(t){return t.cmdState.length>0?t.cmdState[t.cmdState.length-1]:null}function r(t,e,n){return function(){this.name=t,this.bracketNo=0,this.style=e,this.styles=n,this.argument=null,this.styleIdentifier=function(){return this.styles[this.bracketNo-1]||null},this.openBracket=function(){return this.bracketNo++,"bracket"},this.closeBracket=function(){}}}var a={};function i(t,r){if(t.match(/^\\[a-zA-Z@\xc0-\u1fff\u2060-\uffff]+/)){var i,f,o,m,s,l=t.current().slice(1);return e(r,s=new(s=a.hasOwnProperty(l)?a[l]:a.DEFAULT)),r.f=u,s.style}if(t.match(/^\\[$&%#{}_]/)||t.match(/^\\[,;!\/\\]/))return"tag";if(t.match("\\["))return i=function(t,e){return c(t,e,"\\]")},r.f=i,"keyword";if(t.match("\\("))return f=function(t,e){return c(t,e,"\\)")},r.f=f,"keyword";if(t.match("$$"))return o=function(t,e){return c(t,e,"$$")},r.f=o,"keyword";if(t.match("$"))return m=function(t,e){return c(t,e,"$")},r.f=m,"keyword";var h=t.next();return"%"==h?(t.skipToEnd(),"comment"):"}"==h||"]"==h?(s=n(r))?(s.closeBracket(h),r.f=u,"bracket"):"error":"{"==h||"["==h?(e(r,s=new(s=a.DEFAULT)),"bracket"):/\d/.test(h)?(t.eatWhile(/[\w.%]/),"atom"):(t.eatWhile(/[\w\-_]/),"begin"==(s=function(t){for(var e=t.cmdState,n=e.length-1;n>=0;n--){var r=e[n];if("DEFAULT"!=r.name)return r}return{styleIdentifier:function(){return null}}}(r)).name&&(s.argument=t.current()),s.styleIdentifier())}function c(t,e,n){if(t.eatSpace())return null;if(n&&t.match(n))return e.f=i,"keyword";if(t.match(/^\\[a-zA-Z@]+/))return"tag";if(t.match(/^[a-zA-Z]+/))return"variableName.special";if(t.match(/^\\[$&%#{}_]/)||t.match(/^\\[,;!\/]/)||t.match(/^[\^_&]/))return"tag";if(t.match(/^[+\-<>|=,\/@!*:;'"`~#?]/))return null;if(t.match(/^(\d+\.\d*|\d*\.\d+|\d+)/))return"number";var r=t.next();return"{"==r||"}"==r||"["==r||"]"==r||"("==r||")"==r?"bracket":"%"==r?(t.skipToEnd(),"comment"):"error"}function u(t,e){var r,a=t.peek();return"{"==a||"["==a?(n(e).openBracket(a),t.eat(a),e.f=i,"bracket"):/[ \t\r]/.test(a)?(t.eat(a),null):(e.f=i,(r=e.cmdState.pop())&&r.closeBracket(),i(t,e))}return a.importmodule=r("importmodule","tag",["string","builtin"]),a.documentclass=r("documentclass","tag",["","atom"]),a.usepackage=r("usepackage","tag",["atom"]),a.begin=r("begin","tag",["atom"]),a.end=r("end","tag",["atom"]),a.label=r("label","tag",["atom"]),a.ref=r("ref","tag",["atom"]),a.eqref=r("eqref","tag",["atom"]),a.cite=r("cite","tag",["atom"]),a.bibitem=r("bibitem","tag",["atom"]),a.Bibitem=r("Bibitem","tag",["atom"]),a.RBibitem=r("RBibitem","tag",["atom"]),a.DEFAULT=function(){this.name="DEFAULT",this.style="tag",this.styleIdentifier=this.openBracket=this.closeBracket=function(){}},{name:"stex",startState:function(){return{cmdState:[],f:t?function(t,e){return c(t,e)}:i}},copyState:function(t){return{cmdState:t.cmdState.slice(),f:t.f}},token:function(t,e){return e.f(t,e)},blankLine:function(t){t.f=i,t.cmdState.length=0},languageData:{commentTokens:{line:"%"}}}}n.r(e),n.d(e,{stex:()=>a,stexMath:()=>i});let a=r(!1),i=r(!0)}}]);