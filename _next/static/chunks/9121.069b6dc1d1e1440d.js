"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[9121],{9121:(e,n,a)=>{a.r(n),a.d(n,{mbox:()=>p});var r=["From","Sender","Reply-To","To","Cc","Bcc","Message-ID","In-Reply-To","References","Resent-From","Resent-Sender","Resent-To","Resent-Cc","Resent-Bcc","Resent-Message-ID","Return-Path","Received"],t=["Date","Subject","Comments","Keywords","Resent-Date"],i=/^[ \t]/,o=/^From /,d=RegExp("^("+r.join("|")+"): "),s=RegExp("^("+t.join("|")+"): "),m=/^[^:]+:/,c=/^[^ ]+@[^ ]+/,u=/^.*?(?=[^ ]+?@[^ ]+)/,l=/^<.*?>/,h=/^.*?(?=<.*>)/;let p={name:"mbox",startState:function(){return{inSeparator:!1,inHeader:!1,emailPermitted:!1,header:null,inHeaders:!1}},token:function(e,n){if(e.sol()){if(n.inSeparator=!1,n.inHeader&&e.match(i))return null;if(n.inHeader=!1,n.header=null,e.match(o))return n.inHeaders=!0,n.inSeparator=!0,"atom";var a,r=!1;return(a=e.match(s))||(r=!0,a=e.match(d))?(n.inHeaders=!0,n.inHeader=!0,n.emailPermitted=r,n.header=a[1],"atom"):n.inHeaders&&(a=e.match(m))?(n.inHeader=!0,n.emailPermitted=!0,n.header=a[1],"atom"):(n.inHeaders=!1,e.skipToEnd(),null)}if(n.inSeparator)return e.match(c)?"link":(e.match(u)||e.skipToEnd(),"atom");if(n.inHeader){var t="Subject"===n.header?"header":"string";if(n.emailPermitted){if(e.match(l))return t+" link";if(e.match(h))return t}return e.skipToEnd(),t}return e.skipToEnd(),null},blankLine:function(e){e.inHeaders=e.inSeparator=e.inHeader=!1},languageData:{autocomplete:r.concat(t)}}}}]);