"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[6443],{6443:(e,t,n)=>{n.r(t),n.d(t,{toml:()=>r});let r={name:"toml",startState:function(){return{inString:!1,stringType:"",lhs:!0,inArray:0}},token:function(e,t){if(t.inString||'"'!=e.peek()&&"'"!=e.peek()||(t.stringType=e.peek(),e.next(),t.inString=!0),e.sol()&&0===t.inArray&&(t.lhs=!0),t.inString){for(;t.inString&&!e.eol();)e.peek()===t.stringType?(e.next(),t.inString=!1):"\\"===e.peek()?(e.next(),e.next()):e.match(/^.[^\\\"\']*/);return t.lhs?"property":"string"}if(t.inArray&&"]"===e.peek())return e.next(),t.inArray--,"bracket";if(t.lhs&&"["===e.peek()&&e.skipTo("]"))return e.next(),"]"===e.peek()&&e.next(),"atom";if("#"===e.peek())return e.skipToEnd(),"comment";if(e.eatSpace());else if(t.lhs&&e.eatWhile(function(e){return"="!=e&&" "!=e}))return"property";else if(t.lhs&&"="===e.peek())e.next(),t.lhs=!1;else{if(!t.lhs&&e.match(/^\d\d\d\d[\d\-\:\.T]*Z/)||!t.lhs&&(e.match("true")||e.match("false")))return"atom";if(!t.lhs&&"["===e.peek())return t.inArray++,e.next(),"bracket";if(!t.lhs&&e.match(/^\-?\d+(?:\.\d+)?/))return"number";e.eatSpace()||e.next()}return null},languageData:{commentTokens:{line:"#"}}}}}]);