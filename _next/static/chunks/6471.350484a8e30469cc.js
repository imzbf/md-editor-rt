"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6471],{6471:(e,t,n)=>{var r,i,a;function u(e,t,n){return function(r,i){for(;!r.eol();){if(r.match(t)){i.tokenize=c;break}r.next()}return n&&(i.tokenize=n),e}}function o(e){return function(t,n){for(;!t.eol();)t.next();return n.tokenize=c,e}}function c(e,t){function n(n){return t.tokenize=n,n(e,t)}var r=e.sol(),i=e.next();switch(i){case"{":return e.eat("/"),e.eatSpace(),e.eatWhile(/[^\s\u00a0=\"\'\/?(}]/),t.tokenize=f,"tag";case"_":if(e.eat("_"))return n(u("strong","__",c));break;case"'":if(e.eat("'"))return n(u("em","''",c));break;case"(":if(e.eat("("))return n(u("link","))",c));break;case"[":return n(u("url","]",c));case"|":if(e.eat("|"))return n(u("comment","||"));break;case"-":if(e.eat("="))return n(u("header string","=-",c));if(e.eat("-"))return n(u("error tw-deleted","--",c));break;case"=":if(e.match("=="))return n(u("tw-underline","===",c));break;case":":if(e.eat(":"))return n(u("comment","::"));break;case"^":return n(u("tw-box","^"));case"~":if(e.match("np~"))return n(u("meta","~/np~"))}if(r)switch(i){case"!":if(e.match("!!!!!")||e.match("!!!!"))return n(o("header string"));if(e.match("!!!"))return n(o("header string"));if(e.match("!!"))return n(o("header string"));else return n(o("header string"));case"*":case"#":case"+":return n(o("tw-listitem bracket"))}return null}function f(e,t){var n=e.next(),i=e.peek();return"}"==n?(t.tokenize=c,"tag"):"("==n||")"==n?"bracket":"="==n?(r="equals",">"==i&&(e.next(),i=e.peek()),/[\'\"]/.test(i)||(t.tokenize=function(e,t){for(;!e.eol();){var n=e.next(),r=e.peek();if(" "==n||","==n||/[ )}]/.test(r)){t.tokenize=f;break}}return"string"}),"operator"):/[\'\"]/.test(n)?(t.tokenize=function(e,t){for(;!e.eol();)if(e.next()==n){t.tokenize=f;break}return"string"},t.tokenize(e,t)):(e.eatWhile(/[^\s\u00a0=\"\'\/?]/),"keyword")}function s(){for(var e=arguments.length-1;e>=0;e--)i.cc.push(arguments[e])}function l(){return s.apply(null,arguments),!0}function k(e,t){var n=i.context&&i.context.noIndent;i.context={prev:i.context,pluginName:e,indent:i.indented,startOfLine:t,noIndent:n}}function d(){i.context&&(i.context=i.context.prev)}function g(e){return"keyword"==e?(a="attribute",l(g)):"equals"==e?l(p,g):s()}function p(e){return"keyword"==e?(a="string",l()):"string"==e?l(m):s()}function m(e){return"string"==e?l(m):s()}n.r(t),n.d(t,{tiki:()=>h});let h={name:"tiki",startState:function(){return{tokenize:c,cc:[],indented:0,startOfLine:!0,pluginName:null,context:null}},token:function(e,t){if(e.sol()&&(t.startOfLine=!0,t.indented=e.indentation()),e.eatSpace())return null;a=r=null;var n=t.tokenize(e,t);if((n||r)&&"comment"!=n)for(i=t;!(t.cc.pop()||function(e){if("openPlugin"==e){var t;return i.pluginName=null,l(g,(t=i.startOfLine,function(e){return"selfclosePlugin"==e||"endPlugin"==e||"endPlugin"==e&&k(i.pluginName,t),l()}))}if("closePlugin"==e){var n,r=!1;return i.context?(r=null!=i.context.pluginName,d()):r=!0,r&&(a="error"),l((n=r,function(e){return(n&&(a="error"),"endPlugin"==e)?l():s()}))}return"string"==e&&(i.context&&"!cdata"==i.context.name||k("!cdata"),i.tokenize==c&&d()),l()})(r||n););return t.startOfLine=!1,a||n},indent:function(e,t,n){var r=e.context;if(r&&r.noIndent)return 0;for(r&&/^{\//.test(t)&&(r=r.prev);r&&!r.startOfLine;)r=r.prev;return r?r.indent+n.unit:0}}}}]);