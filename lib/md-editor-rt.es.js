var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
import React, { useEffect, useState, useRef, cloneElement, useLayoutEffect, useContext, useMemo, useCallback, createContext } from "react";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var classnames = { exports: {} };
/*!
  Copyright (c) 2018 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
(function(module) {
  (function() {
    var hasOwn = {}.hasOwnProperty;
    function classNames() {
      var classes = [];
      for (var i = 0; i < arguments.length; i++) {
        var arg = arguments[i];
        if (!arg)
          continue;
        var argType = typeof arg;
        if (argType === "string" || argType === "number") {
          classes.push(arg);
        } else if (Array.isArray(arg)) {
          if (arg.length) {
            var inner = classNames.apply(null, arg);
            if (inner) {
              classes.push(inner);
            }
          }
        } else if (argType === "object") {
          if (arg.toString === Object.prototype.toString) {
            for (var key in arg) {
              if (hasOwn.call(arg, key) && arg[key]) {
                classes.push(key);
              }
            }
          } else {
            classes.push(arg.toString());
          }
        }
      }
      return classes.join(" ");
    }
    if (module.exports) {
      classNames.default = classNames;
      module.exports = classNames;
    } else {
      window.classNames = classNames;
    }
  })();
})(classnames);
var cn = classnames.exports;
class Bus {
  constructor() {
    __publicField(this, "pools", {});
  }
  remove(race, name, func) {
    const targetRace = this.pools[race];
    const events = targetRace && this.pools[race][name];
    if (events) {
      this.pools[race][name] = events.filter((item) => item === func);
    }
  }
  clear(race) {
    this.pools[race] = {};
  }
  on(race, event) {
    if (!this.pools[race]) {
      this.pools[race] = {};
    }
    if (!this.pools[race][event.name]) {
      this.pools[race][event.name] = [];
    }
    this.pools[race][event.name].push(event.callback);
    return this.pools[race][event.name].includes(event.callback);
  }
  emit(race, name, ...params) {
    const targetRace = this.pools[race];
    const events = targetRace[name];
    if (events) {
      events.forEach((item) => {
        try {
          item(...params);
        } catch (error) {
          console.error(`${name} monitor event exception\uFF01`, error);
        }
      });
    }
  }
}
var bus = new Bus();
const prefix = "md";
const iconfontUrl = "https://at.alicdn.com/t/font_2605852_khjf435c7th.js";
const highlightUrl = {
  atom: "https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/atom-one-dark.css",
  github: "https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/github.css",
  githubDark: "https://cdn.jsdelivr.net/npm/highlight.js@11.2.0/styles/github-dark.css",
  js: "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.2.0/build/highlight.min.js"
};
const prettierUrl = {
  main: "https://cdn.jsdelivr.net/npm/prettier@2.4.0/standalone.js",
  markdown: "https://cdn.jsdelivr.net/npm/prettier@2.4.0/parser-markdown.js"
};
const cropperUrl = {
  css: "https://cdn.jsdelivr.net/npm/cropperjs@1.5.12/dist/cropper.min.css",
  js: "https://cdn.jsdelivr.net/npm/cropperjs@1.5.12/dist/cropper.min.js"
};
const screenfullUrl = "https://cdn.jsdelivr.net/npm/screenfull@5.1.0/dist/screenfull.js";
const allToolbar = [
  "bold",
  "underline",
  "italic",
  "strikeThrough",
  "-",
  "title",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "-",
  "revoke",
  "next",
  "save",
  "=",
  "prettier",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "htmlPreview",
  "github"
];
const staticTextDefault = {
  "zh-CN": {
    toolbarTips: {
      bold: "\u52A0\u7C97",
      underline: "\u4E0B\u5212\u7EBF",
      italic: "\u659C\u4F53",
      strikeThrough: "\u5220\u9664\u7EBF",
      title: "\u6807\u9898",
      sub: "\u4E0B\u6807",
      sup: "\u4E0A\u6807",
      quote: "\u5F15\u7528",
      unorderedList: "\u65E0\u5E8F\u5217\u8868",
      orderedList: "\u6709\u5E8F\u5217\u8868",
      codeRow: "\u884C\u5185\u4EE3\u7801",
      code: "\u5757\u7EA7\u4EE3\u7801",
      link: "\u94FE\u63A5",
      image: "\u56FE\u7247",
      table: "\u8868\u683C",
      revoke: "\u540E\u9000",
      next: "\u524D\u8FDB",
      save: "\u4FDD\u5B58",
      prettier: "\u7F8E\u5316",
      pageFullscreen: "\u6D4F\u89C8\u5668\u5168\u5C4F",
      fullscreen: "\u5C4F\u5E55\u5168\u5C4F",
      preview: "\u9884\u89C8",
      htmlPreview: "html\u4EE3\u7801\u9884\u89C8",
      github: "\u6E90\u7801\u5730\u5740"
    },
    titleItem: {
      h1: "\u4E00\u7EA7\u6807\u9898",
      h2: "\u4E8C\u7EA7\u6807\u9898",
      h3: "\u4E09\u7EA7\u6807\u9898",
      h4: "\u56DB\u7EA7\u6807\u9898",
      h5: "\u4E94\u7EA7\u6807\u9898",
      h6: "\u516D\u7EA7\u6807\u9898"
    },
    imgTitleItem: {
      link: "\u6DFB\u52A0\u94FE\u63A5",
      upload: "\u4E0A\u4F20\u56FE\u7247",
      clip2upload: "\u88C1\u526A\u4E0A\u4F20"
    },
    linkModalTips: {
      title: "\u6DFB\u52A0",
      descLable: "\u94FE\u63A5\u63CF\u8FF0\uFF1A",
      descLablePlaceHolder: "\u8BF7\u8F93\u5165\u63CF\u8FF0...",
      urlLable: "\u94FE\u63A5\u5730\u5740\uFF1A",
      UrlLablePlaceHolder: "\u8BF7\u8F93\u5165\u94FE\u63A5...",
      buttonOK: "\u786E\u5B9A"
    },
    clipModalTips: {
      title: "\u88C1\u526A\u56FE\u7247\u4E0A\u4F20",
      buttonUpload: "\u4E0A\u4F20"
    },
    copyCode: {
      text: "\u590D\u5236\u4EE3\u7801",
      tips: "\u5DF2\u590D\u5236\uFF01"
    }
  },
  "en-US": {
    toolbarTips: {
      bold: "bold",
      underline: "underline",
      italic: "italic",
      strikeThrough: "strikeThrough",
      title: "title",
      sub: "subscript",
      sup: "superscript",
      quote: "quote",
      unorderedList: "unordered list",
      orderedList: "ordered list",
      codeRow: "inline code",
      code: "block-level code",
      link: "link",
      image: "image",
      table: "table",
      revoke: "revoke",
      next: "undo revoke",
      save: "save",
      prettier: "prettier",
      pageFullscreen: "fullscreen in page",
      fullscreen: "fullscreen",
      preview: "preview",
      htmlPreview: "html preview",
      github: "source code"
    },
    titleItem: {
      h1: "Lv1 Heading",
      h2: "Lv2 Heading",
      h3: "Lv3 Heading",
      h4: "Lv4 Heading",
      h5: "Lv5 Heading",
      h6: "Lv6 Heading"
    },
    imgTitleItem: {
      link: "Add Img Link",
      upload: "Upload Img",
      clip2upload: "Clip Upload"
    },
    linkModalTips: {
      title: "Add ",
      descLable: "Desc:",
      descLablePlaceHolder: "Enter a description...",
      urlLable: "Link:",
      UrlLablePlaceHolder: "Enter a link...",
      buttonOK: "OK"
    },
    clipModalTips: {
      title: "Crop Image",
      buttonUpload: "Upload"
    },
    copyCode: {
      text: "Copy",
      tips: "Copied!"
    }
  }
};
const keyMove = (trigger, moveHandler) => {
  const triggerMouseDown = (mdown) => {
    if (mdown.target !== trigger) {
      return;
    }
    const parent = trigger.parentElement || document.body;
    const width = parent.offsetWidth;
    const height = parent.offsetHeight;
    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;
    const x = mdown.offsetX;
    const y = mdown.offsetY;
    const mouseMoveHandler = (e) => {
      let tx = (e.pageX || e.clientX + document.body.scrollLeft - document.body.clientLeft) - x;
      let ty = (e.pageY || e.clientY + document.body.scrollTop - document.body.clientTop) - y;
      tx = tx < 1 ? 1 : tx < clientWidth - width - 1 ? tx : clientWidth - width - 1;
      ty = ty < 1 ? 1 : ty < clientHeight - height - 1 ? ty : clientHeight - height - 1;
      if (moveHandler) {
        moveHandler(tx, ty);
      } else {
        parent.style.left = tx + "px";
        parent.style.top = ty + "px";
      }
    };
    document.addEventListener("mousemove", mouseMoveHandler);
    const mouseUpHandler = () => {
      document.removeEventListener("mousemove", mouseMoveHandler);
      trigger.removeEventListener("mouseup", mouseUpHandler);
    };
    trigger.addEventListener("mouseup", mouseUpHandler);
  };
  trigger.addEventListener("mousedown", triggerMouseDown);
  return () => {
    trigger.removeEventListener("mousedown", triggerMouseDown);
  };
};
const appendHandler = (ele) => {
  if (!document.getElementById(ele.id)) {
    document.head.appendChild(ele);
  }
};
const useKeyBoard = (props) => {
  const { editorId } = props;
  const initFunc = (name) => {
    var _a, _b;
    return ((_a = props.toolbars) == null ? void 0 : _a.includes(name)) && !((_b = props.toolbarsExclude) == null ? void 0 : _b.includes(name));
  };
  const keyDownHandler = (event) => {
    if (event.target !== document.querySelector(`#${props.editorId}-textarea`)) {
      return;
    }
    if (event.ctrlKey || event.metaKey) {
      switch (event.code) {
        case "KeyS": {
          if (event.shiftKey) {
            if (initFunc("strikeThrough")) {
              bus.emit(editorId, "replace", "strikeThrough");
            }
          } else {
            if (initFunc("save")) {
              bus.emit(editorId, "onSave", props.modelValue);
              event.preventDefault();
            }
          }
          break;
        }
        case "KeyB": {
          if (initFunc("bold")) {
            bus.emit(editorId, "replace", "bold");
            event.preventDefault();
          }
          break;
        }
        case "KeyU": {
          if (event.shiftKey) {
            if (initFunc("unorderedList")) {
              bus.emit(editorId, "replace", "unorderedList");
              event.preventDefault();
            }
          } else {
            if (initFunc("underline")) {
              bus.emit(editorId, "replace", "underline");
              event.preventDefault();
            }
          }
          break;
        }
        case "KeyI": {
          if (event.shiftKey) {
            if (initFunc("image")) {
              bus.emit(editorId, "openModals", "image");
              event.preventDefault();
            }
          } else {
            if (initFunc("italic")) {
              bus.emit(editorId, "replace", "italic");
              event.preventDefault();
            }
          }
          break;
        }
        case "Digit1": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h1");
            event.preventDefault();
          }
          break;
        }
        case "Digit2": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h2");
            event.preventDefault();
          }
          break;
        }
        case "Digit3": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h3");
            event.preventDefault();
          }
          break;
        }
        case "Digit4": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h4");
            event.preventDefault();
          }
          break;
        }
        case "Digit5": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h5");
            event.preventDefault();
          }
          break;
        }
        case "Digit6": {
          if (initFunc("title")) {
            bus.emit(editorId, "replace", "h6");
            event.preventDefault();
          }
          break;
        }
        case "ArrowUp": {
          if (initFunc("sup")) {
            bus.emit(editorId, "replace", "sup");
            event.preventDefault();
          }
          break;
        }
        case "ArrowDown": {
          if (initFunc("sub")) {
            bus.emit(editorId, "replace", "sub");
            event.preventDefault();
          }
          break;
        }
        case "KeyQ": {
          bus.emit(editorId, "replace", "quote");
          event.preventDefault();
          break;
        }
        case "KeyO": {
          if (initFunc("orderedList")) {
            bus.emit(editorId, "replace", "orderedList");
            event.preventDefault();
          }
          break;
        }
        case "KeyC": {
          if (event.shiftKey) {
            if (initFunc("code")) {
              bus.emit(editorId, "replace", "code");
              event.preventDefault();
            }
          } else if (event.altKey) {
            if (initFunc("codeRow")) {
              bus.emit(editorId, "replace", "codeRow");
              event.preventDefault();
            }
          } else {
            event.preventDefault();
            bus.emit(editorId, "replace", "ctrlC");
            break;
          }
          break;
        }
        case "KeyL": {
          if (initFunc("link")) {
            bus.emit(editorId, "openModals", "link");
            event.preventDefault();
          }
          break;
        }
        case "KeyZ": {
          if (event.shiftKey) {
            if (initFunc("next")) {
              bus.emit(editorId, "ctrlShiftZ");
              event.preventDefault();
            }
          } else {
            if (initFunc("revoke")) {
              bus.emit(editorId, "ctrlZ");
              event.preventDefault();
            }
          }
          break;
        }
        case "KeyF": {
          if (event.shiftKey) {
            if (initFunc("prettier")) {
              bus.emit(editorId, "replace", "prettier");
              event.preventDefault();
            }
          }
          break;
        }
        case "KeyT": {
          if (event.altKey && event.shiftKey) {
            if (initFunc("table")) {
              bus.emit(editorId, "replace", "table");
              event.preventDefault();
            }
          }
          break;
        }
        case "KeyX": {
          bus.emit(editorId, "replace", "ctrlX");
          event.preventDefault();
          break;
        }
        case "KeyD": {
          event.preventDefault();
          bus.emit(editorId, "replace", "ctrlD");
          break;
        }
      }
    } else if (event.code === "Tab") {
      event.preventDefault();
      if (event.shiftKey) {
        bus.emit(editorId, "replace", "shiftTab");
      } else {
        bus.emit(editorId, "replace", "tab");
      }
    }
  };
  const pasteHandler = (e) => {
    if (e.clipboardData && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (/image\/.*/.test(file.type)) {
        bus.emit(editorId, "uploadImage", [file]);
        e.preventDefault();
      }
    }
  };
  useEffect(() => {
    if (!props.previewOnly) {
      window.addEventListener("keydown", keyDownHandler);
      document.addEventListener("paste", pasteHandler);
    }
    return () => {
      if (!props.previewOnly) {
        window.removeEventListener("keydown", keyDownHandler);
        document.removeEventListener("paste", pasteHandler);
      }
    };
  }, []);
  useEffect(() => {
    if (props.previewOnly) {
      return;
    }
    const callback = () => {
      if (props.onSave) {
        props.onSave(props.modelValue);
      }
    };
    bus.remove(editorId, "onSave", callback);
    bus.on(editorId, {
      name: "onSave",
      callback
    });
  }, [props.modelValue]);
};
const useExpansion = (props) => {
  const {
    iconfontJs,
    prettier,
    prettierCDN,
    prettierMDCDN,
    previewOnly,
    cropperCss,
    cropperJs
  } = props;
  useEffect(() => {
    const iconfontScript = document.createElement("script");
    iconfontScript.src = iconfontJs;
    iconfontScript.id = `${prefix}-icon`;
    const prettierScript = document.createElement("script");
    const prettierMDScript = document.createElement("script");
    prettierScript.src = prettierCDN;
    prettierScript.id = `${prefix}-prettier`;
    prettierMDScript.src = prettierMDCDN;
    prettierMDScript.id = `${prefix}-prettierMD`;
    const cropperLink = document.createElement("link");
    cropperLink.rel = "stylesheet";
    cropperLink.href = cropperCss;
    cropperLink.id = `${prefix}-cropperCss`;
    const cropperScript = document.createElement("script");
    cropperScript.src = cropperJs;
    cropperScript.id = `${prefix}-cropper`;
    if (!previewOnly) {
      appendHandler(iconfontScript);
      if (!props.Cropper) {
        appendHandler(cropperLink);
        appendHandler(cropperScript);
      }
      if (prettier) {
        appendHandler(prettierScript);
        appendHandler(prettierMDScript);
      }
    }
    return () => {
      if (!previewOnly) {
        document.head.removeChild(iconfontScript);
        document.head.removeChild(cropperLink);
        document.head.removeChild(cropperScript);
        if (prettier) {
          document.head.removeChild(prettierScript);
          document.head.removeChild(prettierMDScript);
        }
      }
    };
  }, []);
};
const setPosition = (tarDom, startPos = 0, endPos = startPos) => {
  if (tarDom.setSelectionRange) {
    setTimeout(() => {
      tarDom.setSelectionRange(startPos, endPos);
      tarDom.focus();
    }, 0);
  } else {
    console.log("can not reset position\uFF01");
  }
};
const insert = (dom, tarValue, params) => {
  const { deviationStart = 0, deviationEnd = 0, direct = false, select = false } = params;
  let res = "";
  if (dom.selectionStart || dom.selectionStart === 0) {
    const startPos = dom.selectionStart;
    const endPos = dom.selectionEnd || 0;
    const {
      prefixVal = dom.value.substring(0, startPos),
      subfixVal = dom.value.substring(endPos, dom.value.length)
    } = params;
    res = prefixVal + tarValue + subfixVal;
    setPosition(dom, select ? startPos + deviationStart : startPos + tarValue.length + deviationEnd, startPos + tarValue.length + deviationEnd);
  } else {
    res += tarValue;
  }
  if (direct) {
    dom.value = res;
  }
  return res;
};
const goto = (url, option = {
  newWindow: true,
  nofollow: true
}) => {
  if (!url) {
    console.warn("\u65E0\u6548\u7684\u94FE\u63A5\uFF01");
  }
  const aEle = document.createElement("a");
  aEle.href = url;
  aEle.style.display = "none";
  if (option.newWindow) {
    aEle.target = "_blank";
  }
  if (option.nofollow) {
    aEle.rel = "noopener noreferrer";
  }
  document.body.appendChild(aEle);
  aEle.click();
  document.body.removeChild(aEle);
};
const scrollAuto = (pEle, cEle) => {
  const pHeight = pEle.clientHeight;
  const cHeight = cEle.clientHeight;
  const pScrollHeight = pEle.scrollHeight;
  const cScrollHeight = cEle.scrollHeight;
  const scale = (pScrollHeight - pHeight) / (cScrollHeight - cHeight);
  const scrollHandler = () => {
    cEle.scrollTo({
      top: pEle.scrollTop / scale
    });
  };
  pEle.removeEventListener("scroll", scrollHandler);
  pEle.addEventListener("scroll", scrollHandler);
  return () => {
    pEle.removeEventListener("scroll", scrollHandler);
  };
};
const base642File = (base64, fileName = "image.png") => {
  const arr = base64.split(",");
  const regResult = arr[0].match(/:(.*?);/);
  if (regResult) {
    const mime = regResult[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const file = new File([u8arr], fileName, { type: mime });
    return file;
  }
  return null;
};
const generateCodeRowNumber = (code) => {
  if (!code.trim()) {
    return code;
  }
  const list = code.split("\n");
  const rowNumberList = ['<span rn-wrapper aria-hidden="true">'];
  list.forEach(() => {
    rowNumberList.push("<span></span>");
  });
  rowNumberList.push("</span>");
  return `<span class="code-block">${code}</span>${rowNumberList.join("")}`;
};
var index$1 = "";
var Divider = () => /* @__PURE__ */ React.createElement("div", {
  className: `${prefix}-divider`
});
var style$2 = "";
const DropDown = (props) => {
  const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;
  const [ctl, setCtl] = useState({
    overlayClass: [HIDDEN_CLASS],
    overlayStyle: {},
    triggerHover: false,
    overlayHover: false
  });
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const triggerHandler = () => {
    if (props.trigger === "hover") {
      ctl.triggerHover = true;
    }
    const triggerEle = triggerRef.current;
    const overlayEle = overlayRef.current;
    const triggerInfo = triggerEle.getBoundingClientRect();
    const triggerTop = triggerEle.offsetTop;
    const triggerLeft = triggerEle.offsetLeft;
    const triggerHeight = triggerInfo.height;
    const triggerWidth = triggerInfo.width;
    setCtl(__spreadProps(__spreadValues({}, ctl), {
      overlayStyle: {
        top: triggerTop + triggerHeight + "px",
        left: triggerLeft - overlayEle.offsetWidth / 2 + triggerWidth / 2 + "px"
      }
    }));
    props.onChange(true);
  };
  const overlayHandler = () => {
    ctl.overlayHover = true;
  };
  useEffect(() => {
    if (props.visible) {
      setCtl((ctlN) => {
        return __spreadProps(__spreadValues({}, ctlN), {
          overlayClass: ctl.overlayClass.filter((classItem) => classItem !== HIDDEN_CLASS)
        });
      });
    } else {
      setCtl((ctlN) => {
        return __spreadProps(__spreadValues({}, ctlN), {
          overlayClass: [...ctlN.overlayClass, HIDDEN_CLASS]
        });
      });
    }
  }, [props.visible]);
  const clickHidden = (e) => {
    const triggerEle = triggerRef.current;
    const overlayEle = overlayRef.current;
    if (!triggerEle.contains(e.target) && !overlayEle.contains(e.target)) {
      props.onChange(false);
    }
  };
  let hiddenTimer = -1;
  const leaveHidden = (e) => {
    if (triggerRef.current === e.target) {
      ctl.triggerHover = false;
    } else {
      ctl.overlayHover = false;
    }
    clearTimeout(hiddenTimer);
    hiddenTimer = window.setTimeout(() => {
      if (!ctl.overlayHover && !ctl.triggerHover) {
        props.onChange(false);
      }
    }, 10);
  };
  useEffect(() => {
    if (props.trigger === "click") {
      triggerRef.current.addEventListener("click", triggerHandler);
      document.addEventListener("click", clickHidden);
    } else {
      triggerRef.current.addEventListener("mouseenter", triggerHandler);
      triggerRef.current.addEventListener("mouseleave", leaveHidden);
      overlayRef.current.addEventListener("mouseenter", overlayHandler);
      overlayRef.current.addEventListener("mouseleave", leaveHidden);
    }
    return () => {
      if (props.trigger === "click" && triggerRef.current) {
        triggerRef.current.removeEventListener("click", triggerHandler);
        document.removeEventListener("click", clickHidden);
      } else {
        if (triggerRef.current) {
          triggerRef.current.removeEventListener("mouseenter", triggerHandler);
          triggerRef.current.removeEventListener("mouseleave", leaveHidden);
        }
        if (overlayRef.current) {
          overlayRef.current.removeEventListener("mouseenter", overlayHandler);
          overlayRef.current.removeEventListener("mouseleave", leaveHidden);
        }
      }
    };
  }, []);
  const slotDefault = props.children;
  const slotOverlay = props.overlay;
  const trigger = cloneElement(slotDefault, {
    ref: triggerRef
  });
  const overlay = /* @__PURE__ */ React.createElement("div", {
    className: cn(`${prefix}-dropdown`, ctl.overlayClass),
    style: ctl.overlayStyle,
    ref: overlayRef
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-dropdown-overlay`
  }, slotOverlay instanceof Array ? slotOverlay[0] : slotOverlay));
  return /* @__PURE__ */ React.createElement(React.Fragment, null, trigger, overlay);
};
var style$1 = "";
const Modal = (props) => {
  const { onClosed = () => {
  } } = props;
  const [modalVisible, setMV] = useState(props.visible);
  const [modalClass, setModalClass] = useState([`${prefix}-modal`]);
  const modalRef = useRef(null);
  const modalHeaderRef = useRef(null);
  const [state, setState] = useState({
    initPos: {
      left: "0px",
      top: "0px"
    },
    historyPos: {
      left: "0px",
      top: "0px"
    }
  });
  const [inited, setInited] = useState(false);
  useLayoutEffect(() => {
    let keyMoveClear = () => {
    };
    setTimeout(() => {
      keyMoveClear = keyMove(modalHeaderRef.current, (left, top) => {
        setState(__spreadProps(__spreadValues({}, state), {
          initPos: {
            left: left + "px",
            top: top + "px"
          }
        }));
      });
    }, 0);
    return keyMoveClear;
  }, [inited]);
  useEffect(() => {
    if (modalVisible) {
      const halfWidth = modalRef.current.offsetWidth / 2;
      const halfHeight = modalRef.current.offsetHeight / 2;
      const halfClientWidth = document.documentElement.clientWidth / 2;
      const halfClientHeight = document.documentElement.clientHeight / 2;
      setState(__spreadProps(__spreadValues({}, state), {
        initPos: {
          left: halfClientWidth - halfWidth + "px",
          top: halfClientHeight - halfHeight + "px"
        }
      }));
      !inited && setInited(true);
    }
  }, [modalVisible]);
  useEffect(() => {
    const nVal = props.visible;
    if (nVal) {
      setModalClass(() => [`${prefix}-modal`, "zoom-in"]);
      setMV(nVal);
    } else if (inited) {
      setModalClass(() => [`${prefix}-modal`, "zoom-out"]);
      setTimeout(() => {
        setMV(nVal);
      }, 150);
    }
  }, [props.visible]);
  return /* @__PURE__ */ React.createElement("div", {
    style: { display: modalVisible ? "block" : "none" }
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-mask`,
    onClick: onClosed
  }), /* @__PURE__ */ React.createElement("div", {
    className: cn(modalClass),
    style: __spreadProps(__spreadValues({}, state.initPos), {
      width: props.width,
      height: props.height
    }),
    ref: modalRef
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-header`,
    ref: modalHeaderRef
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-title`
  }, props.title || ""), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-func`
  }, props.showAdjust && /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-adjust`,
    onClick: (e) => {
      e.stopPropagation();
      if (!props.isFullscreen) {
        setState((_state) => ({
          historyPos: _state.initPos,
          initPos: {
            left: "0",
            top: "0"
          }
        }));
      } else {
        setState((_state) => __spreadProps(__spreadValues({}, _state), {
          initPos: _state.historyPos
        }));
      }
      props.onAdjust(!props.isFullscreen);
    }
  }, /* @__PURE__ */ React.createElement("svg", {
    className: `${prefix}-icon`,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("use", {
    xlinkHref: `#icon-${props.isFullscreen ? "suoxiao" : "fangda"}`
  }))), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-close`,
    onClick: (e) => {
      e.stopPropagation();
      props.onClosed && props.onClosed();
    }
  }, /* @__PURE__ */ React.createElement("svg", {
    className: `${prefix}-icon`,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("use", {
    xlinkHref: "#icon-close"
  }))))), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-modal-body`
  }, props.children)));
};
Modal.defaultProps = {
  onAdjust() {
  }
};
const LinkModal = (props) => {
  var _a, _b, _c, _d, _e;
  const { usedLanguageText } = useContext(EditorContext);
  const { editorId } = useContext(EditorContext);
  const title = useMemo(() => {
    var _a2, _b2, _c2, _d2;
    switch (props.type) {
      case "link": {
        return `${(_a2 = usedLanguageText.linkModalTips) == null ? void 0 : _a2.title}${(_b2 = usedLanguageText.toolbarTips) == null ? void 0 : _b2.link}`;
      }
      case "image": {
        return `${(_c2 = usedLanguageText.linkModalTips) == null ? void 0 : _c2.title}${(_d2 = usedLanguageText.toolbarTips) == null ? void 0 : _d2.image}`;
      }
      default: {
        return "";
      }
    }
  }, [props.type]);
  const [linkData, setLinkData] = useState({
    desc: "",
    url: ""
  });
  useEffect(() => {
    if (!props.visible) {
      setTimeout(() => {
        setLinkData({
          desc: "",
          url: ""
        });
      }, 200);
    }
  }, [props.visible]);
  return /* @__PURE__ */ React.createElement(Modal, {
    title,
    visible: props.visible,
    onClosed: props.onCancel
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-form-item`
  }, /* @__PURE__ */ React.createElement("label", {
    className: `${prefix}-lable`,
    htmlFor: `link-desc-${editorId}`
  }, (_a = usedLanguageText.linkModalTips) == null ? void 0 : _a.descLable), /* @__PURE__ */ React.createElement("input", {
    placeholder: (_b = usedLanguageText.linkModalTips) == null ? void 0 : _b.descLablePlaceHolder,
    className: `${prefix}-input`,
    id: `link-desc-${editorId}`,
    type: "text",
    value: linkData.desc,
    onChange: (e) => {
      setLinkData(__spreadProps(__spreadValues({}, linkData), {
        desc: e.target.value
      }));
    }
  })), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-form-item`
  }, /* @__PURE__ */ React.createElement("label", {
    className: `${prefix}-lable`,
    htmlFor: `link-url-${editorId}`
  }, (_c = usedLanguageText.linkModalTips) == null ? void 0 : _c.urlLable), /* @__PURE__ */ React.createElement("input", {
    placeholder: (_d = usedLanguageText.linkModalTips) == null ? void 0 : _d.UrlLablePlaceHolder,
    className: `${prefix}-input`,
    id: `link-url-${editorId}`,
    type: "text",
    value: linkData.url,
    onChange: (e) => {
      setLinkData(__spreadProps(__spreadValues({}, linkData), {
        url: e.target.value
      }));
    }
  })), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-form-item`
  }, /* @__PURE__ */ React.createElement("button", {
    className: `${prefix}-btn ${prefix}-btn-row`,
    type: "button",
    onClick: () => {
      props.onOk(linkData);
      setLinkData(__spreadProps(__spreadValues({}, linkData), {
        desc: "",
        url: ""
      }));
    }
  }, (_e = usedLanguageText.linkModalTips) == null ? void 0 : _e.buttonOK)));
};
var style = "";
let cropper = null;
const ClipModal = (props) => {
  var _a, _b;
  const editorConext = useContext(EditorContext);
  const { editorId, usedLanguageText, Cropper } = editorConext;
  const uploadRef = useRef(null);
  const uploadImgRef = useRef(null);
  const previewTargetRef = useRef(null);
  const [data, setData] = useState({
    cropperInited: false,
    imgSelected: false,
    imgSrc: "",
    isFullscreen: false
  });
  useEffect(() => {
    if (props.visible && !data.cropperInited) {
      window.Cropper = Cropper || window.Cropper;
      uploadRef.current.onchange = () => {
        const fileList = uploadRef.current.files || [];
        if ((fileList == null ? void 0 : fileList.length) > 0) {
          const fileReader = new FileReader();
          fileReader.onload = (e) => {
            setData((_data) => __spreadProps(__spreadValues({}, _data), {
              imgSelected: true,
              imgSrc: e.target.result
            }));
          };
          fileReader.readAsDataURL(fileList[0]);
        }
      };
    }
  }, [props.visible]);
  useEffect(() => {
    if (data.imgSrc) {
      cropper = new window.Cropper(uploadImgRef.current, {
        viewMode: 2,
        preview: `.${prefix}-clip-preview-target`
      });
    }
  }, [data.imgSrc]);
  useEffect(() => {
    var _a2;
    (_a2 = previewTargetRef.current) == null ? void 0 : _a2.setAttribute("style", "");
  }, [data.imgSelected]);
  useEffect(() => {
    var _a2;
    cropper == null ? void 0 : cropper.destroy();
    (_a2 = previewTargetRef.current) == null ? void 0 : _a2.setAttribute("style", "");
    if (uploadImgRef.current) {
      cropper = new window.Cropper(uploadImgRef.current, {
        viewMode: 2,
        preview: `.${prefix}-clip-preview-target`
      });
    }
  }, [data.isFullscreen]);
  const modalSize = useMemo(() => {
    return data.isFullscreen ? {
      width: "100%",
      height: "100%"
    } : {
      width: "668px",
      height: "392px"
    };
  }, [data.isFullscreen]);
  const reset = () => {
    cropper.destroy();
    uploadRef.current.value = "";
    setData((_data) => __spreadProps(__spreadValues({}, _data), {
      imgSrc: "",
      imgSelected: false
    }));
  };
  return /* @__PURE__ */ React.createElement(Modal, __spreadValues({
    title: (_a = usedLanguageText.clipModalTips) == null ? void 0 : _a.title,
    visible: props.visible,
    onClosed: props.onCancel,
    showAdjust: true,
    isFullscreen: data.isFullscreen,
    onAdjust: (val) => {
      setData(__spreadProps(__spreadValues({}, data), {
        isFullscreen: val
      }));
    }
  }, modalSize), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-form-item ${prefix}-clip`
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-main`
  }, data.imgSelected ? /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-cropper`
  }, /* @__PURE__ */ React.createElement("img", {
    src: data.imgSrc,
    ref: uploadImgRef,
    style: { display: "none" }
  }), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-delete`,
    onClick: reset
  }, /* @__PURE__ */ React.createElement("svg", {
    className: `${prefix}-icon`,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("use", {
    xlinkHref: "#icon-delete"
  })))) : /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-upload`,
    onClick: () => {
      uploadRef.current.click();
    }
  }, /* @__PURE__ */ React.createElement("svg", {
    className: `${prefix}-icon`,
    "aria-hidden": "true"
  }, /* @__PURE__ */ React.createElement("use", {
    xlinkHref: "#icon-upload"
  })))), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-preview`
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-clip-preview-target`,
    ref: previewTargetRef
  }))), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-form-item`
  }, /* @__PURE__ */ React.createElement("button", {
    className: `${prefix}-btn`,
    onClick: () => {
      const cvs = cropper.getCroppedCanvas();
      bus.emit(editorId, "uploadImage", [base642File(cvs.toDataURL("image/png"))], props.onOk);
      reset();
    }
  }, (_b = usedLanguageText.linkModalTips) == null ? void 0 : _b.buttonOK)), /* @__PURE__ */ React.createElement("input", {
    ref: uploadRef,
    accept: "image/*",
    type: "file",
    multiple: false,
    style: { display: "none" }
  }));
};
const Modals = (props) => {
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(LinkModal, {
    type: props.type,
    visible: props.linkVisible,
    onOk: props.onOk,
    onCancel: props.onCancel
  }), /* @__PURE__ */ React.createElement(ClipModal, {
    visible: props.clipVisible,
    onOk: props.onOk,
    onCancel: props.onCancel
  }));
};
const useSreenfull = (props) => {
  let { screenfull } = props;
  const { previewOnly } = useContext(EditorContext);
  const fullScreenHandler = useCallback(() => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    } else {
      console.error("browser does not support screenfull!");
    }
  }, [screenfull]);
  const screenfullLoad = () => {
    screenfull = window.screenfull;
    if (screenfull && screenfull.isEnabled) {
      screenfull.on("change", () => {
        props.updateSetting(!props.setting.fullscreen, "fullscreen");
      });
    }
  };
  useEffect(() => {
    let screenScript;
    if (!previewOnly && !props.screenfull) {
      screenScript = document.createElement("script");
      screenScript.src = props.screenfullJs;
      screenScript.addEventListener("load", screenfullLoad);
      screenScript.id = `${prefix}-screenfull`;
      appendHandler(screenScript);
    }
    if (!previewOnly && screenfull && screenfull.isEnabled) {
      screenfull.on("change", () => {
        props.updateSetting(!props.setting.fullscreen, "fullscreen");
      });
    }
    return () => {
      if (!previewOnly && !props.screenfull) {
        document.head.removeChild(screenScript);
      }
    };
  }, []);
  return { fullScreenHandler, screenfullLoad };
};
const Toolbar = (props) => {
  const { toolbars, toolbarsExclude, setting, updateSetting } = props;
  const { editorId, usedLanguageText } = useContext(EditorContext);
  const ult = usedLanguageText;
  const { fullScreenHandler } = useSreenfull(props);
  const [visible, setVisible] = useState({
    title: false,
    catalog: false,
    image: false
  });
  const emitHandler = (direct, params) => {
    bus.emit(editorId, "replace", direct, params);
  };
  const [modalData, setModalData] = useState({
    type: "link",
    linkVisible: false,
    clipVisible: false
  });
  const toolbarLeftRef = useRef(null);
  let splitNum = 0;
  const barRender = (barItem) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _A, _B, _C, _D, _E, _F, _G;
    switch (barItem) {
      case "-": {
        return /* @__PURE__ */ React.createElement(Divider, {
          key: `bar-${splitNum++}`
        });
      }
      case "bold": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_a = ult.toolbarTips) == null ? void 0 : _a.bold,
          onClick: () => {
            emitHandler("bold");
          },
          key: "bar-bold"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-bold"
        })));
      }
      case "underline": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_b = ult.toolbarTips) == null ? void 0 : _b.underline,
          onClick: () => {
            emitHandler("underline");
          },
          key: "bar-underline"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-underline"
        })));
      }
      case "italic": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_c = ult.toolbarTips) == null ? void 0 : _c.italic,
          onClick: () => {
            emitHandler("italic");
          },
          key: "bar-italic"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-italic"
        })));
      }
      case "strikeThrough": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_d = ult.toolbarTips) == null ? void 0 : _d.strikeThrough,
          onClick: () => {
            emitHandler("strikeThrough");
          },
          key: "bar-strikeThrough"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-strike-through"
        })));
      }
      case "title": {
        return /* @__PURE__ */ React.createElement(DropDown, {
          visible: visible.title,
          onChange: (v) => {
            setVisible(__spreadProps(__spreadValues({}, visible), {
              title: v
            }));
          },
          overlay: /* @__PURE__ */ React.createElement("ul", {
            className: `${prefix}-menu`,
            onClick: () => {
              setVisible(__spreadProps(__spreadValues({}, visible), {
                title: false
              }));
            }
          }, /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h1");
            }
          }, (_e = ult.titleItem) == null ? void 0 : _e.h1), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h2");
            }
          }, (_f = ult.titleItem) == null ? void 0 : _f.h2), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h3");
            }
          }, (_g = ult.titleItem) == null ? void 0 : _g.h3), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h4");
            }
          }, (_h = ult.titleItem) == null ? void 0 : _h.h4), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h5");
            }
          }, (_i = ult.titleItem) == null ? void 0 : _i.h5), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              emitHandler("h6");
            }
          }, (_j = ult.titleItem) == null ? void 0 : _j.h6)),
          key: "bar-title"
        }, /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_k = ult.toolbarTips) == null ? void 0 : _k.title
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-title"
        }))));
      }
      case "sub": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_l = ult.toolbarTips) == null ? void 0 : _l.sub,
          onClick: () => {
            emitHandler("sub");
          },
          key: "bar-sub"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-sub"
        })));
      }
      case "sup": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_m = ult.toolbarTips) == null ? void 0 : _m.sup,
          onClick: () => {
            emitHandler("sup");
          },
          key: "bar-sup"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-sup"
        })));
      }
      case "quote": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_n = ult.toolbarTips) == null ? void 0 : _n.quote,
          onClick: () => {
            emitHandler("quote");
          },
          key: "bar-quote"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-quote"
        })));
      }
      case "unorderedList": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_o = ult.toolbarTips) == null ? void 0 : _o.unorderedList,
          onClick: () => {
            emitHandler("unorderedList");
          },
          key: "bar-unorderedList"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-unordered-list"
        })));
      }
      case "orderedList": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_p = ult.toolbarTips) == null ? void 0 : _p.orderedList,
          onClick: () => {
            emitHandler("orderedList");
          },
          key: "bar-orderedList"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-ordered-list"
        })));
      }
      case "codeRow": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_q = ult.toolbarTips) == null ? void 0 : _q.codeRow,
          onClick: () => {
            emitHandler("codeRow");
          },
          key: "bar-codeRow"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-code-row"
        })));
      }
      case "code": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_r = ult.toolbarTips) == null ? void 0 : _r.code,
          onClick: () => {
            emitHandler("code");
          },
          key: "bar-code"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-code"
        })));
      }
      case "link": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_s = ult.toolbarTips) == null ? void 0 : _s.link,
          onClick: () => {
            setModalData(__spreadProps(__spreadValues({}, modalData), {
              type: "link",
              linkVisible: true
            }));
          },
          key: "bar-link"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-link"
        })));
      }
      case "image": {
        return /* @__PURE__ */ React.createElement(DropDown, {
          visible: visible.image,
          onChange: (v) => {
            setVisible(__spreadProps(__spreadValues({}, visible), {
              image: v
            }));
          },
          overlay: /* @__PURE__ */ React.createElement("ul", {
            className: `${prefix}-menu`,
            onClick: () => {
              setVisible(__spreadProps(__spreadValues({}, visible), {
                title: false
              }));
            }
          }, /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              modalData.type = "image";
              modalData.linkVisible = true;
            }
          }, (_t = ult.imgTitleItem) == null ? void 0 : _t.link), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              uploadRef.current.click();
            }
          }, (_u = ult.imgTitleItem) == null ? void 0 : _u.upload), /* @__PURE__ */ React.createElement("li", {
            className: `${prefix}-menu-item`,
            onClick: () => {
              modalData.clipVisible = true;
            }
          }, (_v = ult.imgTitleItem) == null ? void 0 : _v.clip2upload)),
          key: "bar-image"
        }, /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_w = ult.toolbarTips) == null ? void 0 : _w.image
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-image"
        }))));
      }
      case "table": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_x = ult.toolbarTips) == null ? void 0 : _x.table,
          onClick: () => {
            emitHandler("table");
          },
          key: "bar-table"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-table"
        })));
      }
      case "revoke": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_y = ult.toolbarTips) == null ? void 0 : _y.revoke,
          onClick: () => {
            bus.emit(editorId, "ctrlZ");
          },
          key: "bar-revoke"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-revoke"
        })));
      }
      case "next": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_z = ult.toolbarTips) == null ? void 0 : _z.next,
          onClick: () => {
            bus.emit(editorId, "ctrlShiftZ");
          },
          key: "bar-next"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-next"
        })));
      }
      case "save": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_A = ult.toolbarTips) == null ? void 0 : _A.save,
          onClick: () => {
            bus.emit(editorId, "onSave");
          },
          key: "bar-save"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-baocun"
        })));
      }
      case "prettier": {
        return props.prettier ? /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_B = ult.toolbarTips) == null ? void 0 : _B.prettier,
          onClick: () => {
            emitHandler("prettier");
          },
          key: "bar-prettier"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-prettier"
        }))) : "";
      }
      case "pageFullscreen": {
        return !setting.fullscreen && /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_C = ult.toolbarTips) == null ? void 0 : _C.pageFullscreen,
          onClick: () => {
            updateSetting(!setting.pageFullScreen, "pageFullScreen");
          },
          key: "bar-pageFullscreen"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: `#icon-${setting.pageFullScreen ? "suoxiao" : "fangda"}`
        })));
      }
      case "fullscreen": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_D = ult.toolbarTips) == null ? void 0 : _D.fullscreen,
          onClick: fullScreenHandler,
          key: "bar-fullscreen"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: `#icon-${setting.fullscreen ? "fullScreen-exit" : "fullScreen"}`
        })));
      }
      case "preview": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_E = ult.toolbarTips) == null ? void 0 : _E.preview,
          onClick: () => {
            updateSetting(!setting.preview, "preview");
          },
          key: "bar-preview"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-preview"
        })));
      }
      case "htmlPreview": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_F = ult.toolbarTips) == null ? void 0 : _F.htmlPreview,
          onClick: () => {
            updateSetting(!setting.htmlPreview, "htmlPreview");
          },
          key: "bar-htmlPreview"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-coding"
        })));
      }
      case "github": {
        return /* @__PURE__ */ React.createElement("div", {
          className: `${prefix}-toolbar-item`,
          title: (_G = ult.toolbarTips) == null ? void 0 : _G.github,
          onClick: () => goto("https://github.com/imzbf/md-editor-rt"),
          key: "bar-github"
        }, /* @__PURE__ */ React.createElement("svg", {
          className: `${prefix}-icon`,
          "aria-hidden": "true"
        }, /* @__PURE__ */ React.createElement("use", {
          xlinkHref: "#icon-github"
        })));
      }
    }
  };
  const splitedbar = useMemo(() => {
    const excluedBars = toolbars.filter((barItem) => !toolbarsExclude.includes(barItem));
    const moduleSplitIndex = excluedBars.indexOf("=");
    const barLeft = moduleSplitIndex === -1 ? excluedBars : excluedBars.slice(0, moduleSplitIndex + 1);
    const barRight = moduleSplitIndex === -1 ? [] : excluedBars.slice(moduleSplitIndex, Number.MAX_SAFE_INTEGER);
    return [barLeft, barRight];
  }, [toolbars, toolbarsExclude]);
  const uploadRef = useRef(null);
  const uploadHandler = () => {
    bus.emit(editorId, "uploadImage", uploadRef.current.files);
    uploadRef.current.value = "";
  };
  useEffect(() => {
    var _a;
    bus.on(editorId, {
      name: "openModals",
      callback(type) {
        setModalData(__spreadProps(__spreadValues({}, modalData), {
          type,
          linkVisible: true
        }));
      }
    });
    (_a = toolbarLeftRef.current) == null ? void 0 : _a.addEventListener("mouseover", () => {
      var _a2;
      if (!((_a2 = window.getSelection()) == null ? void 0 : _a2.toString())) {
        bus.emit(editorId, "selectTextChange", "");
      }
    });
    uploadRef.current.addEventListener("change", uploadHandler);
  }, []);
  return /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-toolbar-wrapper`
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-toolbar`
  }, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-toolbar-left`,
    ref: toolbarLeftRef
  }, splitedbar[0].map((barItem) => barRender(barItem))), /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-toolbar-right`
  }, splitedbar[1].map((barItem) => barRender(barItem)))), /* @__PURE__ */ React.createElement("input", {
    ref: uploadRef,
    accept: "image/*",
    type: "file",
    multiple: true,
    style: { display: "none" }
  }), /* @__PURE__ */ React.createElement(Modals, {
    linkVisible: modalData.linkVisible,
    clipVisible: modalData.clipVisible,
    type: modalData.type,
    onCancel: () => {
      setModalData(__spreadProps(__spreadValues({}, modalData), {
        linkVisible: false,
        clipVisible: false
      }));
    },
    onOk: (data) => {
      if (data) {
        emitHandler(modalData.type, {
          desc: data.desc,
          url: data.url
        });
      }
      setModalData(__spreadProps(__spreadValues({}, modalData), {
        linkVisible: false,
        clipVisible: false
      }));
    }
  }));
};
var marked$1 = { exports: {} };
(function(module, exports) {
  (function(global2, factory) {
    module.exports = factory();
  })(commonjsGlobal, function() {
    function _defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor)
          descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }
    function _createClass(Constructor, protoProps, staticProps) {
      if (protoProps)
        _defineProperties(Constructor.prototype, protoProps);
      if (staticProps)
        _defineProperties(Constructor, staticProps);
      return Constructor;
    }
    function _unsupportedIterableToArray(o, minLen) {
      if (!o)
        return;
      if (typeof o === "string")
        return _arrayLikeToArray(o, minLen);
      var n = Object.prototype.toString.call(o).slice(8, -1);
      if (n === "Object" && o.constructor)
        n = o.constructor.name;
      if (n === "Map" || n === "Set")
        return Array.from(o);
      if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))
        return _arrayLikeToArray(o, minLen);
    }
    function _arrayLikeToArray(arr, len) {
      if (len == null || len > arr.length)
        len = arr.length;
      for (var i = 0, arr2 = new Array(len); i < len; i++)
        arr2[i] = arr[i];
      return arr2;
    }
    function _createForOfIteratorHelperLoose(o, allowArrayLike) {
      var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
      if (it)
        return (it = it.call(o)).next.bind(it);
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it)
          o = it;
        var i = 0;
        return function() {
          if (i >= o.length)
            return {
              done: true
            };
          return {
            done: false,
            value: o[i++]
          };
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var defaults$5 = { exports: {} };
    function getDefaults$1() {
      return {
        baseUrl: null,
        breaks: false,
        extensions: null,
        gfm: true,
        headerIds: true,
        headerPrefix: "",
        highlight: null,
        langPrefix: "language-",
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }
    function changeDefaults$1(newDefaults) {
      defaults$5.exports.defaults = newDefaults;
    }
    defaults$5.exports = {
      defaults: getDefaults$1(),
      getDefaults: getDefaults$1,
      changeDefaults: changeDefaults$1
    };
    var escapeTest = /[&<>"']/;
    var escapeReplace = /[&<>"']/g;
    var escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
    var escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
    var escapeReplacements = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var getEscapeReplacement = function getEscapeReplacement2(ch) {
      return escapeReplacements[ch];
    };
    function escape$2(html, encode) {
      if (encode) {
        if (escapeTest.test(html)) {
          return html.replace(escapeReplace, getEscapeReplacement);
        }
      } else {
        if (escapeTestNoEncode.test(html)) {
          return html.replace(escapeReplaceNoEncode, getEscapeReplacement);
        }
      }
      return html;
    }
    var unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
    function unescape$1(html) {
      return html.replace(unescapeTest, function(_, n) {
        n = n.toLowerCase();
        if (n === "colon")
          return ":";
        if (n.charAt(0) === "#") {
          return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
        }
        return "";
      });
    }
    var caret = /(^|[^\[])\^/g;
    function edit$1(regex, opt) {
      regex = regex.source || regex;
      opt = opt || "";
      var obj = {
        replace: function replace(name, val) {
          val = val.source || val;
          val = val.replace(caret, "$1");
          regex = regex.replace(name, val);
          return obj;
        },
        getRegex: function getRegex() {
          return new RegExp(regex, opt);
        }
      };
      return obj;
    }
    var nonWordAndColonTest = /[^\w:]/g;
    var originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
    function cleanUrl$1(sanitize, base, href) {
      if (sanitize) {
        var prot;
        try {
          prot = decodeURIComponent(unescape$1(href)).replace(nonWordAndColonTest, "").toLowerCase();
        } catch (e) {
          return null;
        }
        if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
          return null;
        }
      }
      if (base && !originIndependentUrl.test(href)) {
        href = resolveUrl(base, href);
      }
      try {
        href = encodeURI(href).replace(/%25/g, "%");
      } catch (e) {
        return null;
      }
      return href;
    }
    var baseUrls = {};
    var justDomain = /^[^:]+:\/*[^/]*$/;
    var protocol = /^([^:]+:)[\s\S]*$/;
    var domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
    function resolveUrl(base, href) {
      if (!baseUrls[" " + base]) {
        if (justDomain.test(base)) {
          baseUrls[" " + base] = base + "/";
        } else {
          baseUrls[" " + base] = rtrim$1(base, "/", true);
        }
      }
      base = baseUrls[" " + base];
      var relativeBase = base.indexOf(":") === -1;
      if (href.substring(0, 2) === "//") {
        if (relativeBase) {
          return href;
        }
        return base.replace(protocol, "$1") + href;
      } else if (href.charAt(0) === "/") {
        if (relativeBase) {
          return href;
        }
        return base.replace(domain, "$1") + href;
      } else {
        return base + href;
      }
    }
    var noopTest$1 = {
      exec: function noopTest2() {
      }
    };
    function merge$2(obj) {
      var i = 1, target, key;
      for (; i < arguments.length; i++) {
        target = arguments[i];
        for (key in target) {
          if (Object.prototype.hasOwnProperty.call(target, key)) {
            obj[key] = target[key];
          }
        }
      }
      return obj;
    }
    function splitCells$1(tableRow, count) {
      var row = tableRow.replace(/\|/g, function(match, offset, str) {
        var escaped = false, curr = offset;
        while (--curr >= 0 && str[curr] === "\\") {
          escaped = !escaped;
        }
        if (escaped) {
          return "|";
        } else {
          return " |";
        }
      }), cells = row.split(/ \|/);
      var i = 0;
      if (cells.length > count) {
        cells.splice(count);
      } else {
        while (cells.length < count) {
          cells.push("");
        }
      }
      for (; i < cells.length; i++) {
        cells[i] = cells[i].trim().replace(/\\\|/g, "|");
      }
      return cells;
    }
    function rtrim$1(str, c, invert) {
      var l = str.length;
      if (l === 0) {
        return "";
      }
      var suffLen = 0;
      while (suffLen < l) {
        var currChar = str.charAt(l - suffLen - 1);
        if (currChar === c && !invert) {
          suffLen++;
        } else if (currChar !== c && invert) {
          suffLen++;
        } else {
          break;
        }
      }
      return str.substr(0, l - suffLen);
    }
    function findClosingBracket$1(str, b) {
      if (str.indexOf(b[1]) === -1) {
        return -1;
      }
      var l = str.length;
      var level = 0, i = 0;
      for (; i < l; i++) {
        if (str[i] === "\\") {
          i++;
        } else if (str[i] === b[0]) {
          level++;
        } else if (str[i] === b[1]) {
          level--;
          if (level < 0) {
            return i;
          }
        }
      }
      return -1;
    }
    function checkSanitizeDeprecation$1(opt) {
      if (opt && opt.sanitize && !opt.silent) {
        console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
      }
    }
    function repeatString$1(pattern, count) {
      if (count < 1) {
        return "";
      }
      var result = "";
      while (count > 1) {
        if (count & 1) {
          result += pattern;
        }
        count >>= 1;
        pattern += pattern;
      }
      return result + pattern;
    }
    var helpers = {
      escape: escape$2,
      unescape: unescape$1,
      edit: edit$1,
      cleanUrl: cleanUrl$1,
      resolveUrl,
      noopTest: noopTest$1,
      merge: merge$2,
      splitCells: splitCells$1,
      rtrim: rtrim$1,
      findClosingBracket: findClosingBracket$1,
      checkSanitizeDeprecation: checkSanitizeDeprecation$1,
      repeatString: repeatString$1
    };
    var defaults$4 = defaults$5.exports.defaults;
    var rtrim = helpers.rtrim, splitCells = helpers.splitCells, _escape = helpers.escape, findClosingBracket = helpers.findClosingBracket;
    function outputLink(cap, link, raw) {
      var href = link.href;
      var title = link.title ? _escape(link.title) : null;
      var text = cap[1].replace(/\\([\[\]])/g, "$1");
      if (cap[0].charAt(0) !== "!") {
        return {
          type: "link",
          raw,
          href,
          title,
          text
        };
      } else {
        return {
          type: "image",
          raw,
          href,
          title,
          text: _escape(text)
        };
      }
    }
    function indentCodeCompensation(raw, text) {
      var matchIndentToCode = raw.match(/^(\s+)(?:```)/);
      if (matchIndentToCode === null) {
        return text;
      }
      var indentToCode = matchIndentToCode[1];
      return text.split("\n").map(function(node) {
        var matchIndentInNode = node.match(/^\s+/);
        if (matchIndentInNode === null) {
          return node;
        }
        var indentInNode = matchIndentInNode[0];
        if (indentInNode.length >= indentToCode.length) {
          return node.slice(indentToCode.length);
        }
        return node;
      }).join("\n");
    }
    var Tokenizer_1 = /* @__PURE__ */ function() {
      function Tokenizer2(options) {
        this.options = options || defaults$4;
      }
      var _proto = Tokenizer2.prototype;
      _proto.space = function space(src) {
        var cap = this.rules.block.newline.exec(src);
        if (cap) {
          if (cap[0].length > 1) {
            return {
              type: "space",
              raw: cap[0]
            };
          }
          return {
            raw: "\n"
          };
        }
      };
      _proto.code = function code(src) {
        var cap = this.rules.block.code.exec(src);
        if (cap) {
          var text = cap[0].replace(/^ {1,4}/gm, "");
          return {
            type: "code",
            raw: cap[0],
            codeBlockStyle: "indented",
            text: !this.options.pedantic ? rtrim(text, "\n") : text
          };
        }
      };
      _proto.fences = function fences(src) {
        var cap = this.rules.block.fences.exec(src);
        if (cap) {
          var raw = cap[0];
          var text = indentCodeCompensation(raw, cap[3] || "");
          return {
            type: "code",
            raw,
            lang: cap[2] ? cap[2].trim() : cap[2],
            text
          };
        }
      };
      _proto.heading = function heading(src) {
        var cap = this.rules.block.heading.exec(src);
        if (cap) {
          var text = cap[2].trim();
          if (/#$/.test(text)) {
            var trimmed = rtrim(text, "#");
            if (this.options.pedantic) {
              text = trimmed.trim();
            } else if (!trimmed || / $/.test(trimmed)) {
              text = trimmed.trim();
            }
          }
          return {
            type: "heading",
            raw: cap[0],
            depth: cap[1].length,
            text
          };
        }
      };
      _proto.nptable = function nptable(src) {
        var cap = this.rules.block.nptable.exec(src);
        if (cap) {
          var item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : [],
            raw: cap[0]
          };
          if (item.header.length === item.align.length) {
            var l = item.align.length;
            var i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i], item.header.length);
            }
            return item;
          }
        }
      };
      _proto.hr = function hr(src) {
        var cap = this.rules.block.hr.exec(src);
        if (cap) {
          return {
            type: "hr",
            raw: cap[0]
          };
        }
      };
      _proto.blockquote = function blockquote(src) {
        var cap = this.rules.block.blockquote.exec(src);
        if (cap) {
          var text = cap[0].replace(/^ *> ?/gm, "");
          return {
            type: "blockquote",
            raw: cap[0],
            text
          };
        }
      };
      _proto.list = function list(src) {
        var cap = this.rules.block.list.exec(src);
        if (cap) {
          var raw = cap[0];
          var bull = cap[2];
          var isordered = bull.length > 1;
          var list2 = {
            type: "list",
            raw,
            ordered: isordered,
            start: isordered ? +bull.slice(0, -1) : "",
            loose: false,
            items: []
          };
          var itemMatch = cap[0].match(this.rules.block.item);
          var next = false, item, space, bcurr, bnext, addBack, loose, istask, ischecked, endMatch;
          var l = itemMatch.length;
          bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);
          for (var i = 0; i < l; i++) {
            item = itemMatch[i];
            raw = item;
            if (!this.options.pedantic) {
              endMatch = item.match(new RegExp("\\n\\s*\\n {0," + (bcurr[0].length - 1) + "}\\S"));
              if (endMatch) {
                addBack = item.length - endMatch.index + itemMatch.slice(i + 1).join("\n").length;
                list2.raw = list2.raw.substring(0, list2.raw.length - addBack);
                item = item.substring(0, endMatch.index);
                raw = item;
                l = i + 1;
              }
            }
            if (i !== l - 1) {
              bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);
              if (!this.options.pedantic ? bnext[1].length >= bcurr[0].length || bnext[1].length > 3 : bnext[1].length > bcurr[1].length) {
                itemMatch.splice(i, 2, itemMatch[i] + (!this.options.pedantic && bnext[1].length < bcurr[0].length && !itemMatch[i].match(/\n$/) ? "" : "\n") + itemMatch[i + 1]);
                i--;
                l--;
                continue;
              } else if (!this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                addBack = itemMatch.slice(i + 1).join("\n").length;
                list2.raw = list2.raw.substring(0, list2.raw.length - addBack);
                i = l - 1;
              }
              bcurr = bnext;
            }
            space = item.length;
            item = item.replace(/^ *([*+-]|\d+[.)]) ?/, "");
            if (~item.indexOf("\n ")) {
              space -= item.length;
              item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
            }
            item = rtrim(item, "\n");
            if (i !== l - 1) {
              raw = raw + "\n";
            }
            loose = next || /\n\n(?!\s*$)/.test(raw);
            if (i !== l - 1) {
              next = raw.slice(-2) === "\n\n";
              if (!loose)
                loose = next;
            }
            if (loose) {
              list2.loose = true;
            }
            if (this.options.gfm) {
              istask = /^\[[ xX]\] /.test(item);
              ischecked = void 0;
              if (istask) {
                ischecked = item[1] !== " ";
                item = item.replace(/^\[[ xX]\] +/, "");
              }
            }
            list2.items.push({
              type: "list_item",
              raw,
              task: istask,
              checked: ischecked,
              loose,
              text: item
            });
          }
          return list2;
        }
      };
      _proto.html = function html(src) {
        var cap = this.rules.block.html.exec(src);
        if (cap) {
          return {
            type: this.options.sanitize ? "paragraph" : "html",
            raw: cap[0],
            pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
          };
        }
      };
      _proto.def = function def(src) {
        var cap = this.rules.block.def.exec(src);
        if (cap) {
          if (cap[3])
            cap[3] = cap[3].substring(1, cap[3].length - 1);
          var tag = cap[1].toLowerCase().replace(/\s+/g, " ");
          return {
            type: "def",
            tag,
            raw: cap[0],
            href: cap[2],
            title: cap[3]
          };
        }
      };
      _proto.table = function table(src) {
        var cap = this.rules.block.table.exec(src);
        if (cap) {
          var item = {
            type: "table",
            header: splitCells(cap[1].replace(/^ *| *\| *$/g, "")),
            align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
            cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
          };
          if (item.header.length === item.align.length) {
            item.raw = cap[0];
            var l = item.align.length;
            var i;
            for (i = 0; i < l; i++) {
              if (/^ *-+: *$/.test(item.align[i])) {
                item.align[i] = "right";
              } else if (/^ *:-+: *$/.test(item.align[i])) {
                item.align[i] = "center";
              } else if (/^ *:-+ *$/.test(item.align[i])) {
                item.align[i] = "left";
              } else {
                item.align[i] = null;
              }
            }
            l = item.cells.length;
            for (i = 0; i < l; i++) {
              item.cells[i] = splitCells(item.cells[i].replace(/^ *\| *| *\| *$/g, ""), item.header.length);
            }
            return item;
          }
        }
      };
      _proto.lheading = function lheading(src) {
        var cap = this.rules.block.lheading.exec(src);
        if (cap) {
          return {
            type: "heading",
            raw: cap[0],
            depth: cap[2].charAt(0) === "=" ? 1 : 2,
            text: cap[1]
          };
        }
      };
      _proto.paragraph = function paragraph(src) {
        var cap = this.rules.block.paragraph.exec(src);
        if (cap) {
          return {
            type: "paragraph",
            raw: cap[0],
            text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
          };
        }
      };
      _proto.text = function text(src) {
        var cap = this.rules.block.text.exec(src);
        if (cap) {
          return {
            type: "text",
            raw: cap[0],
            text: cap[0]
          };
        }
      };
      _proto.escape = function escape2(src) {
        var cap = this.rules.inline.escape.exec(src);
        if (cap) {
          return {
            type: "escape",
            raw: cap[0],
            text: _escape(cap[1])
          };
        }
      };
      _proto.tag = function tag(src, inLink, inRawBlock) {
        var cap = this.rules.inline.tag.exec(src);
        if (cap) {
          if (!inLink && /^<a /i.test(cap[0])) {
            inLink = true;
          } else if (inLink && /^<\/a>/i.test(cap[0])) {
            inLink = false;
          }
          if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = true;
          } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
            inRawBlock = false;
          }
          return {
            type: this.options.sanitize ? "text" : "html",
            raw: cap[0],
            inLink,
            inRawBlock,
            text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0]
          };
        }
      };
      _proto.link = function link(src) {
        var cap = this.rules.inline.link.exec(src);
        if (cap) {
          var trimmedUrl = cap[2].trim();
          if (!this.options.pedantic && /^</.test(trimmedUrl)) {
            if (!/>$/.test(trimmedUrl)) {
              return;
            }
            var rtrimSlash = rtrim(trimmedUrl.slice(0, -1), "\\");
            if ((trimmedUrl.length - rtrimSlash.length) % 2 === 0) {
              return;
            }
          } else {
            var lastParenIndex = findClosingBracket(cap[2], "()");
            if (lastParenIndex > -1) {
              var start = cap[0].indexOf("!") === 0 ? 5 : 4;
              var linkLen = start + cap[1].length + lastParenIndex;
              cap[2] = cap[2].substring(0, lastParenIndex);
              cap[0] = cap[0].substring(0, linkLen).trim();
              cap[3] = "";
            }
          }
          var href = cap[2];
          var title = "";
          if (this.options.pedantic) {
            var link2 = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
            if (link2) {
              href = link2[1];
              title = link2[3];
            }
          } else {
            title = cap[3] ? cap[3].slice(1, -1) : "";
          }
          href = href.trim();
          if (/^</.test(href)) {
            if (this.options.pedantic && !/>$/.test(trimmedUrl)) {
              href = href.slice(1);
            } else {
              href = href.slice(1, -1);
            }
          }
          return outputLink(cap, {
            href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
            title: title ? title.replace(this.rules.inline._escapes, "$1") : title
          }, cap[0]);
        }
      };
      _proto.reflink = function reflink(src, links) {
        var cap;
        if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
          var link = (cap[2] || cap[1]).replace(/\s+/g, " ");
          link = links[link.toLowerCase()];
          if (!link || !link.href) {
            var text = cap[0].charAt(0);
            return {
              type: "text",
              raw: text,
              text
            };
          }
          return outputLink(cap, link, cap[0]);
        }
      };
      _proto.emStrong = function emStrong(src, maskedSrc, prevChar) {
        if (prevChar === void 0) {
          prevChar = "";
        }
        var match = this.rules.inline.emStrong.lDelim.exec(src);
        if (!match)
          return;
        if (match[3] && prevChar.match(/(?:[0-9A-Za-z\xAA\xB2\xB3\xB5\xB9\xBA\xBC-\xBE\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0560-\u0588\u05D0-\u05EA\u05EF-\u05F2\u0620-\u064A\u0660-\u0669\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07C0-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u0904-\u0939\u093D\u0950\u0958-\u0961\u0966-\u096F\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09E6-\u09F1\u09F4-\u09F9\u09FC\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A66-\u0A6F\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0AE6-\u0AEF\u0AF9\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B66-\u0B6F\u0B71-\u0B77\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0BE6-\u0BF2\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58-\u0C5A\u0C60\u0C61\u0C66-\u0C6F\u0C78-\u0C7E\u0C80\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CE6-\u0CEF\u0CF1\u0CF2\u0D04-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D54-\u0D56\u0D58-\u0D61\u0D66-\u0D78\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DE6-\u0DEF\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F20-\u0F33\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F-\u1049\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u1090-\u1099\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1369-\u137C\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1820-\u1878\u1880-\u1884\u1887-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A16\u1A20-\u1A54\u1A80-\u1A89\u1A90-\u1A99\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B50-\u1B59\u1B83-\u1BA0\u1BAE-\u1BE5\u1C00-\u1C23\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CE9-\u1CEC\u1CEE-\u1CF3\u1CF5\u1CF6\u1CFA\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2070\u2071\u2074-\u2079\u207F-\u2089\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2150-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2CFD\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u3192-\u3195\u31A0-\u31BF\u31F0-\u31FF\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA830-\uA835\uA840-\uA873\uA882-\uA8B3\uA8D0-\uA8D9\uA8F2-\uA8F7\uA8FB\uA8FD\uA8FE\uA900-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF-\uA9D9\uA9E0-\uA9E4\uA9E6-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA50-\uAA59\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABE2\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD07-\uDD33\uDD40-\uDD78\uDD8A\uDD8B\uDE80-\uDE9C\uDEA0-\uDED0\uDEE1-\uDEFB\uDF00-\uDF23\uDF2D-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC58-\uDC76\uDC79-\uDC9E\uDCA7-\uDCAF\uDCE0-\uDCF2\uDCF4\uDCF5\uDCFB-\uDD1B\uDD20-\uDD39\uDD80-\uDDB7\uDDBC-\uDDCF\uDDD2-\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE40-\uDE48\uDE60-\uDE7E\uDE80-\uDE9F\uDEC0-\uDEC7\uDEC9-\uDEE4\uDEEB-\uDEEF\uDF00-\uDF35\uDF40-\uDF55\uDF58-\uDF72\uDF78-\uDF91\uDFA9-\uDFAF]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDCFA-\uDD23\uDD30-\uDD39\uDE60-\uDE7E\uDE80-\uDEA9\uDEB0\uDEB1\uDF00-\uDF27\uDF30-\uDF45\uDF51-\uDF54\uDFB0-\uDFCB\uDFE0-\uDFF6]|\uD804[\uDC03-\uDC37\uDC52-\uDC6F\uDC83-\uDCAF\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD03-\uDD26\uDD36-\uDD3F\uDD44\uDD47\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDD0-\uDDDA\uDDDC\uDDE1-\uDDF4\uDE00-\uDE11\uDE13-\uDE2B\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEDE\uDEF0-\uDEF9\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF50\uDF5D-\uDF61]|\uD805[\uDC00-\uDC34\uDC47-\uDC4A\uDC50-\uDC59\uDC5F-\uDC61\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDAE\uDDD8-\uDDDB\uDE00-\uDE2F\uDE44\uDE50-\uDE59\uDE80-\uDEAA\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF30-\uDF3B]|\uD806[\uDC00-\uDC2B\uDCA0-\uDCF2\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD2F\uDD3F\uDD41\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD0\uDDE1\uDDE3\uDE00\uDE0B-\uDE32\uDE3A\uDE50\uDE5C-\uDE89\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC2E\uDC40\uDC50-\uDC6C\uDC72-\uDC8F\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD30\uDD46\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD89\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF2\uDFB0\uDFC0-\uDFD4]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF50-\uDF59\uDF5B-\uDF61\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE96\uDF00-\uDF4A\uDF50\uDF93-\uDF9F\uDFE0\uDFE1\uDFE3]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD834[\uDEE0-\uDEF3\uDF60-\uDF78]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD838[\uDD00-\uDD2C\uDD37-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEEB\uDEF0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCC7-\uDCCF\uDD00-\uDD43\uDD4B\uDD50-\uDD59]|\uD83B[\uDC71-\uDCAB\uDCAD-\uDCAF\uDCB1-\uDCB4\uDD01-\uDD2D\uDD2F-\uDD3D\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD00-\uDD0C]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A])/))
          return;
        var nextChar = match[1] || match[2] || "";
        if (!nextChar || nextChar && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar))) {
          var lLength = match[0].length - 1;
          var rDelim, rLength, delimTotal = lLength, midDelimTotal = 0;
          var endReg = match[0][0] === "*" ? this.rules.inline.emStrong.rDelimAst : this.rules.inline.emStrong.rDelimUnd;
          endReg.lastIndex = 0;
          maskedSrc = maskedSrc.slice(-1 * src.length + lLength);
          while ((match = endReg.exec(maskedSrc)) != null) {
            rDelim = match[1] || match[2] || match[3] || match[4] || match[5] || match[6];
            if (!rDelim)
              continue;
            rLength = rDelim.length;
            if (match[3] || match[4]) {
              delimTotal += rLength;
              continue;
            } else if (match[5] || match[6]) {
              if (lLength % 3 && !((lLength + rLength) % 3)) {
                midDelimTotal += rLength;
                continue;
              }
            }
            delimTotal -= rLength;
            if (delimTotal > 0)
              continue;
            rLength = Math.min(rLength, rLength + delimTotal + midDelimTotal);
            if (Math.min(lLength, rLength) % 2) {
              return {
                type: "em",
                raw: src.slice(0, lLength + match.index + rLength + 1),
                text: src.slice(1, lLength + match.index + rLength)
              };
            }
            return {
              type: "strong",
              raw: src.slice(0, lLength + match.index + rLength + 1),
              text: src.slice(2, lLength + match.index + rLength - 1)
            };
          }
        }
      };
      _proto.codespan = function codespan(src) {
        var cap = this.rules.inline.code.exec(src);
        if (cap) {
          var text = cap[2].replace(/\n/g, " ");
          var hasNonSpaceChars = /[^ ]/.test(text);
          var hasSpaceCharsOnBothEnds = /^ /.test(text) && / $/.test(text);
          if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
            text = text.substring(1, text.length - 1);
          }
          text = _escape(text, true);
          return {
            type: "codespan",
            raw: cap[0],
            text
          };
        }
      };
      _proto.br = function br(src) {
        var cap = this.rules.inline.br.exec(src);
        if (cap) {
          return {
            type: "br",
            raw: cap[0]
          };
        }
      };
      _proto.del = function del(src) {
        var cap = this.rules.inline.del.exec(src);
        if (cap) {
          return {
            type: "del",
            raw: cap[0],
            text: cap[2]
          };
        }
      };
      _proto.autolink = function autolink(src, mangle2) {
        var cap = this.rules.inline.autolink.exec(src);
        if (cap) {
          var text, href;
          if (cap[2] === "@") {
            text = _escape(this.options.mangle ? mangle2(cap[1]) : cap[1]);
            href = "mailto:" + text;
          } else {
            text = _escape(cap[1]);
            href = text;
          }
          return {
            type: "link",
            raw: cap[0],
            text,
            href,
            tokens: [{
              type: "text",
              raw: text,
              text
            }]
          };
        }
      };
      _proto.url = function url(src, mangle2) {
        var cap;
        if (cap = this.rules.inline.url.exec(src)) {
          var text, href;
          if (cap[2] === "@") {
            text = _escape(this.options.mangle ? mangle2(cap[0]) : cap[0]);
            href = "mailto:" + text;
          } else {
            var prevCapZero;
            do {
              prevCapZero = cap[0];
              cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
            } while (prevCapZero !== cap[0]);
            text = _escape(cap[0]);
            if (cap[1] === "www.") {
              href = "http://" + text;
            } else {
              href = text;
            }
          }
          return {
            type: "link",
            raw: cap[0],
            text,
            href,
            tokens: [{
              type: "text",
              raw: text,
              text
            }]
          };
        }
      };
      _proto.inlineText = function inlineText(src, inRawBlock, smartypants2) {
        var cap = this.rules.inline.text.exec(src);
        if (cap) {
          var text;
          if (inRawBlock) {
            text = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : _escape(cap[0]) : cap[0];
          } else {
            text = _escape(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
          }
          return {
            type: "text",
            raw: cap[0],
            text
          };
        }
      };
      return Tokenizer2;
    }();
    var noopTest = helpers.noopTest, edit = helpers.edit, merge$1 = helpers.merge;
    var block$1 = {
      newline: /^(?: *(?:\n|$))+/,
      code: /^( {4}[^\n]+(?:\n(?: *(?:\n|$))*)?)+/,
      fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
      hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
      heading: /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/,
      blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
      list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
      html: "^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n *)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n *)+\\n|$))",
      def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
      nptable: noopTest,
      table: noopTest,
      lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
      _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html| +\n)[^\n]+)*)/,
      text: /^[^\n]+/
    };
    block$1._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
    block$1._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
    block$1.def = edit(block$1.def).replace("label", block$1._label).replace("title", block$1._title).getRegex();
    block$1.bullet = /(?:[*+-]|\d{1,9}[.)])/;
    block$1.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
    block$1.item = edit(block$1.item, "gm").replace(/bull/g, block$1.bullet).getRegex();
    block$1.listItemStart = edit(/^( *)(bull) */).replace("bull", block$1.bullet).getRegex();
    block$1.list = edit(block$1.list).replace(/bull/g, block$1.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block$1.def.source + ")").getRegex();
    block$1._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
    block$1._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
    block$1.html = edit(block$1.html, "i").replace("comment", block$1._comment).replace("tag", block$1._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
    block$1.paragraph = edit(block$1._paragraph).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
    block$1.blockquote = edit(block$1.blockquote).replace("paragraph", block$1.paragraph).getRegex();
    block$1.normal = merge$1({}, block$1);
    block$1.gfm = merge$1({}, block$1.normal, {
      nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
      table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
    });
    block$1.gfm.nptable = edit(block$1.gfm.nptable).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
    block$1.gfm.table = edit(block$1.gfm.table).replace("hr", block$1.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", block$1._tag).getRegex();
    block$1.pedantic = merge$1({}, block$1.normal, {
      html: edit(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block$1._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
      def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
      heading: /^(#{1,6})(.*)(?:\n+|$)/,
      fences: noopTest,
      paragraph: edit(block$1.normal._paragraph).replace("hr", block$1.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block$1.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
    });
    var inline$1 = {
      escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
      autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
      url: noopTest,
      tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
      link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
      reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
      nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
      reflinkSearch: "reflink|nolink(?!\\()",
      emStrong: {
        lDelim: /^(?:\*+(?:([punct_])|[^\s*]))|^_+(?:([punct*])|([^\s_]))/,
        rDelimAst: /\_\_[^_*]*?\*[^_*]*?\_\_|[punct_](\*+)(?=[\s]|$)|[^punct*_\s](\*+)(?=[punct_\s]|$)|[punct_\s](\*+)(?=[^punct*_\s])|[\s](\*+)(?=[punct_])|[punct_](\*+)(?=[punct_])|[^punct*_\s](\*+)(?=[^punct*_\s])/,
        rDelimUnd: /\*\*[^_*]*?\_[^_*]*?\*\*|[punct*](\_+)(?=[\s]|$)|[^punct*_\s](\_+)(?=[punct*\s]|$)|[punct*\s](\_+)(?=[^punct*_\s])|[\s](\_+)(?=[punct*])|[punct*](\_+)(?=[punct*])/
      },
      code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
      br: /^( {2,}|\\)\n(?!\s*$)/,
      del: noopTest,
      text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/,
      punctuation: /^([\spunctuation])/
    };
    inline$1._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
    inline$1.punctuation = edit(inline$1.punctuation).replace(/punctuation/g, inline$1._punctuation).getRegex();
    inline$1.blockSkip = /\[[^\]]*?\]\([^\)]*?\)|`[^`]*?`|<[^>]*?>/g;
    inline$1.escapedEmSt = /\\\*|\\_/g;
    inline$1._comment = edit(block$1._comment).replace("(?:-->|$)", "-->").getRegex();
    inline$1.emStrong.lDelim = edit(inline$1.emStrong.lDelim).replace(/punct/g, inline$1._punctuation).getRegex();
    inline$1.emStrong.rDelimAst = edit(inline$1.emStrong.rDelimAst, "g").replace(/punct/g, inline$1._punctuation).getRegex();
    inline$1.emStrong.rDelimUnd = edit(inline$1.emStrong.rDelimUnd, "g").replace(/punct/g, inline$1._punctuation).getRegex();
    inline$1._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
    inline$1._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
    inline$1._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
    inline$1.autolink = edit(inline$1.autolink).replace("scheme", inline$1._scheme).replace("email", inline$1._email).getRegex();
    inline$1._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
    inline$1.tag = edit(inline$1.tag).replace("comment", inline$1._comment).replace("attribute", inline$1._attribute).getRegex();
    inline$1._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
    inline$1._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/;
    inline$1._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
    inline$1.link = edit(inline$1.link).replace("label", inline$1._label).replace("href", inline$1._href).replace("title", inline$1._title).getRegex();
    inline$1.reflink = edit(inline$1.reflink).replace("label", inline$1._label).getRegex();
    inline$1.reflinkSearch = edit(inline$1.reflinkSearch, "g").replace("reflink", inline$1.reflink).replace("nolink", inline$1.nolink).getRegex();
    inline$1.normal = merge$1({}, inline$1);
    inline$1.pedantic = merge$1({}, inline$1.normal, {
      strong: {
        start: /^__|\*\*/,
        middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
        endAst: /\*\*(?!\*)/g,
        endUnd: /__(?!_)/g
      },
      em: {
        start: /^_|\*/,
        middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
        endAst: /\*(?!\*)/g,
        endUnd: /_(?!_)/g
      },
      link: edit(/^!?\[(label)\]\((.*?)\)/).replace("label", inline$1._label).getRegex(),
      reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline$1._label).getRegex()
    });
    inline$1.gfm = merge$1({}, inline$1.normal, {
      escape: edit(inline$1.escape).replace("])", "~|])").getRegex(),
      _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
      url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
      _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
      del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
      text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/
    });
    inline$1.gfm.url = edit(inline$1.gfm.url, "i").replace("email", inline$1.gfm._extended_email).getRegex();
    inline$1.breaks = merge$1({}, inline$1.gfm, {
      br: edit(inline$1.br).replace("{2,}", "*").getRegex(),
      text: edit(inline$1.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
    });
    var rules = {
      block: block$1,
      inline: inline$1
    };
    var Tokenizer$1 = Tokenizer_1;
    var defaults$3 = defaults$5.exports.defaults;
    var block = rules.block, inline = rules.inline;
    var repeatString = helpers.repeatString;
    function smartypants(text) {
      return text.replace(/---/g, "\u2014").replace(/--/g, "\u2013").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1\u2018").replace(/'/g, "\u2019").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1\u201C").replace(/"/g, "\u201D").replace(/\.{3}/g, "\u2026");
    }
    function mangle(text) {
      var out = "", i, ch;
      var l = text.length;
      for (i = 0; i < l; i++) {
        ch = text.charCodeAt(i);
        if (Math.random() > 0.5) {
          ch = "x" + ch.toString(16);
        }
        out += "&#" + ch + ";";
      }
      return out;
    }
    var Lexer_1 = /* @__PURE__ */ function() {
      function Lexer2(options) {
        this.tokens = [];
        this.tokens.links = Object.create(null);
        this.options = options || defaults$3;
        this.options.tokenizer = this.options.tokenizer || new Tokenizer$1();
        this.tokenizer = this.options.tokenizer;
        this.tokenizer.options = this.options;
        var rules2 = {
          block: block.normal,
          inline: inline.normal
        };
        if (this.options.pedantic) {
          rules2.block = block.pedantic;
          rules2.inline = inline.pedantic;
        } else if (this.options.gfm) {
          rules2.block = block.gfm;
          if (this.options.breaks) {
            rules2.inline = inline.breaks;
          } else {
            rules2.inline = inline.gfm;
          }
        }
        this.tokenizer.rules = rules2;
      }
      Lexer2.lex = function lex(src, options) {
        var lexer = new Lexer2(options);
        return lexer.lex(src);
      };
      Lexer2.lexInline = function lexInline(src, options) {
        var lexer = new Lexer2(options);
        return lexer.inlineTokens(src);
      };
      var _proto = Lexer2.prototype;
      _proto.lex = function lex(src) {
        src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ");
        this.blockTokens(src, this.tokens, true);
        this.inline(this.tokens);
        return this.tokens;
      };
      _proto.blockTokens = function blockTokens(src, tokens, top) {
        var _this = this;
        if (tokens === void 0) {
          tokens = [];
        }
        if (top === void 0) {
          top = true;
        }
        if (this.options.pedantic) {
          src = src.replace(/^ +$/gm, "");
        }
        var token, i, l, lastToken, cutSrc, lastParagraphClipped;
        while (src) {
          if (this.options.extensions && this.options.extensions.block && this.options.extensions.block.some(function(extTokenizer) {
            if (token = extTokenizer.call(_this, src, tokens)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              return true;
            }
            return false;
          })) {
            continue;
          }
          if (token = this.tokenizer.space(src)) {
            src = src.substring(token.raw.length);
            if (token.type) {
              tokens.push(token);
            }
            continue;
          }
          if (token = this.tokenizer.code(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === "paragraph") {
              lastToken.raw += "\n" + token.raw;
              lastToken.text += "\n" + token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }
          if (token = this.tokenizer.fences(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.heading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.nptable(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.hr(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.blockquote(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.blockTokens(token.text, [], top);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.list(src)) {
            src = src.substring(token.raw.length);
            l = token.items.length;
            for (i = 0; i < l; i++) {
              token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
            }
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.html(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (top && (token = this.tokenizer.def(src))) {
            src = src.substring(token.raw.length);
            if (!this.tokens.links[token.tag]) {
              this.tokens.links[token.tag] = {
                href: token.href,
                title: token.title
              };
            }
            continue;
          }
          if (token = this.tokenizer.table(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.lheading(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startBlock) {
            (function() {
              var startIndex = Infinity;
              var tempSrc = src.slice(1);
              var tempStart = void 0;
              _this.options.extensions.startBlock.forEach(function(getStartIndex) {
                tempStart = getStartIndex.call(this, tempSrc);
                if (typeof tempStart === "number" && tempStart >= 0) {
                  startIndex = Math.min(startIndex, tempStart);
                }
              });
              if (startIndex < Infinity && startIndex >= 0) {
                cutSrc = src.substring(0, startIndex + 1);
              }
            })();
          }
          if (top && (token = this.tokenizer.paragraph(cutSrc))) {
            lastToken = tokens[tokens.length - 1];
            if (lastParagraphClipped && lastToken.type === "paragraph") {
              lastToken.raw += "\n" + token.raw;
              lastToken.text += "\n" + token.text;
            } else {
              tokens.push(token);
            }
            lastParagraphClipped = cutSrc.length !== src.length;
            src = src.substring(token.raw.length);
            continue;
          }
          if (token = this.tokenizer.text(src)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === "text") {
              lastToken.raw += "\n" + token.raw;
              lastToken.text += "\n" + token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }
          if (src) {
            var errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        return tokens;
      };
      _proto.inline = function inline2(tokens) {
        var i, j, k, l2, row, token;
        var l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          switch (token.type) {
            case "paragraph":
            case "text":
            case "heading": {
              token.tokens = [];
              this.inlineTokens(token.text, token.tokens);
              break;
            }
            case "table": {
              token.tokens = {
                header: [],
                cells: []
              };
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                token.tokens.header[j] = [];
                this.inlineTokens(token.header[j], token.tokens.header[j]);
              }
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.cells[j];
                token.tokens.cells[j] = [];
                for (k = 0; k < row.length; k++) {
                  token.tokens.cells[j][k] = [];
                  this.inlineTokens(row[k], token.tokens.cells[j][k]);
                }
              }
              break;
            }
            case "blockquote": {
              this.inline(token.tokens);
              break;
            }
            case "list": {
              l2 = token.items.length;
              for (j = 0; j < l2; j++) {
                this.inline(token.items[j].tokens);
              }
              break;
            }
          }
        }
        return tokens;
      };
      _proto.inlineTokens = function inlineTokens(src, tokens, inLink, inRawBlock) {
        var _this2 = this;
        if (tokens === void 0) {
          tokens = [];
        }
        if (inLink === void 0) {
          inLink = false;
        }
        if (inRawBlock === void 0) {
          inRawBlock = false;
        }
        var token, lastToken, cutSrc;
        var maskedSrc = src;
        var match;
        var keepPrevChar, prevChar;
        if (this.tokens.links) {
          var links = Object.keys(this.tokens.links);
          if (links.length > 0) {
            while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
              if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
                maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
              }
            }
          }
        }
        while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
        }
        while ((match = this.tokenizer.rules.inline.escapedEmSt.exec(maskedSrc)) != null) {
          maskedSrc = maskedSrc.slice(0, match.index) + "++" + maskedSrc.slice(this.tokenizer.rules.inline.escapedEmSt.lastIndex);
        }
        while (src) {
          if (!keepPrevChar) {
            prevChar = "";
          }
          keepPrevChar = false;
          if (this.options.extensions && this.options.extensions.inline && this.options.extensions.inline.some(function(extTokenizer) {
            if (token = extTokenizer.call(_this2, src, tokens)) {
              src = src.substring(token.raw.length);
              tokens.push(token);
              return true;
            }
            return false;
          })) {
            continue;
          }
          if (token = this.tokenizer.escape(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
            src = src.substring(token.raw.length);
            inLink = token.inLink;
            inRawBlock = token.inRawBlock;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && token.type === "text" && lastToken.type === "text") {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }
          if (token = this.tokenizer.link(src)) {
            src = src.substring(token.raw.length);
            if (token.type === "link") {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
            }
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.reflink(src, this.tokens.links)) {
            src = src.substring(token.raw.length);
            lastToken = tokens[tokens.length - 1];
            if (token.type === "link") {
              token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
              tokens.push(token);
            } else if (lastToken && token.type === "text" && lastToken.type === "text") {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }
          if (token = this.tokenizer.emStrong(src, maskedSrc, prevChar)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.codespan(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.br(src)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.del(src)) {
            src = src.substring(token.raw.length);
            token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
            tokens.push(token);
            continue;
          }
          if (token = this.tokenizer.autolink(src, mangle)) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          if (!inLink && (token = this.tokenizer.url(src, mangle))) {
            src = src.substring(token.raw.length);
            tokens.push(token);
            continue;
          }
          cutSrc = src;
          if (this.options.extensions && this.options.extensions.startInline) {
            (function() {
              var startIndex = Infinity;
              var tempSrc = src.slice(1);
              var tempStart = void 0;
              _this2.options.extensions.startInline.forEach(function(getStartIndex) {
                tempStart = getStartIndex.call(this, tempSrc);
                if (typeof tempStart === "number" && tempStart >= 0) {
                  startIndex = Math.min(startIndex, tempStart);
                }
              });
              if (startIndex < Infinity && startIndex >= 0) {
                cutSrc = src.substring(0, startIndex + 1);
              }
            })();
          }
          if (token = this.tokenizer.inlineText(cutSrc, inRawBlock, smartypants)) {
            src = src.substring(token.raw.length);
            if (token.raw.slice(-1) !== "_") {
              prevChar = token.raw.slice(-1);
            }
            keepPrevChar = true;
            lastToken = tokens[tokens.length - 1];
            if (lastToken && lastToken.type === "text") {
              lastToken.raw += token.raw;
              lastToken.text += token.text;
            } else {
              tokens.push(token);
            }
            continue;
          }
          if (src) {
            var errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
            if (this.options.silent) {
              console.error(errMsg);
              break;
            } else {
              throw new Error(errMsg);
            }
          }
        }
        return tokens;
      };
      _createClass(Lexer2, null, [{
        key: "rules",
        get: function get() {
          return {
            block,
            inline
          };
        }
      }]);
      return Lexer2;
    }();
    var defaults$2 = defaults$5.exports.defaults;
    var cleanUrl = helpers.cleanUrl, escape$1 = helpers.escape;
    var Renderer_1 = /* @__PURE__ */ function() {
      function Renderer2(options) {
        this.options = options || defaults$2;
      }
      var _proto = Renderer2.prototype;
      _proto.code = function code(_code, infostring, escaped) {
        var lang = (infostring || "").match(/\S*/)[0];
        if (this.options.highlight) {
          var out = this.options.highlight(_code, lang);
          if (out != null && out !== _code) {
            escaped = true;
            _code = out;
          }
        }
        _code = _code.replace(/\n$/, "") + "\n";
        if (!lang) {
          return "<pre><code>" + (escaped ? _code : escape$1(_code, true)) + "</code></pre>\n";
        }
        return '<pre><code class="' + this.options.langPrefix + escape$1(lang, true) + '">' + (escaped ? _code : escape$1(_code, true)) + "</code></pre>\n";
      };
      _proto.blockquote = function blockquote(quote) {
        return "<blockquote>\n" + quote + "</blockquote>\n";
      };
      _proto.html = function html(_html) {
        return _html;
      };
      _proto.heading = function heading(text, level, raw, slugger) {
        if (this.options.headerIds) {
          return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text + "</h" + level + ">\n";
        }
        return "<h" + level + ">" + text + "</h" + level + ">\n";
      };
      _proto.hr = function hr() {
        return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
      };
      _proto.list = function list(body, ordered, start) {
        var type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
        return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
      };
      _proto.listitem = function listitem(text) {
        return "<li>" + text + "</li>\n";
      };
      _proto.checkbox = function checkbox(checked) {
        return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
      };
      _proto.paragraph = function paragraph(text) {
        return "<p>" + text + "</p>\n";
      };
      _proto.table = function table(header, body) {
        if (body)
          body = "<tbody>" + body + "</tbody>";
        return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
      };
      _proto.tablerow = function tablerow(content) {
        return "<tr>\n" + content + "</tr>\n";
      };
      _proto.tablecell = function tablecell(content, flags) {
        var type = flags.header ? "th" : "td";
        var tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
        return tag + content + "</" + type + ">\n";
      };
      _proto.strong = function strong(text) {
        return "<strong>" + text + "</strong>";
      };
      _proto.em = function em(text) {
        return "<em>" + text + "</em>";
      };
      _proto.codespan = function codespan(text) {
        return "<code>" + text + "</code>";
      };
      _proto.br = function br() {
        return this.options.xhtml ? "<br/>" : "<br>";
      };
      _proto.del = function del(text) {
        return "<del>" + text + "</del>";
      };
      _proto.link = function link(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        var out = '<a href="' + escape$1(href) + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += ">" + text + "</a>";
        return out;
      };
      _proto.image = function image(href, title, text) {
        href = cleanUrl(this.options.sanitize, this.options.baseUrl, href);
        if (href === null) {
          return text;
        }
        var out = '<img src="' + href + '" alt="' + text + '"';
        if (title) {
          out += ' title="' + title + '"';
        }
        out += this.options.xhtml ? "/>" : ">";
        return out;
      };
      _proto.text = function text(_text) {
        return _text;
      };
      return Renderer2;
    }();
    var TextRenderer_1 = /* @__PURE__ */ function() {
      function TextRenderer2() {
      }
      var _proto = TextRenderer2.prototype;
      _proto.strong = function strong(text) {
        return text;
      };
      _proto.em = function em(text) {
        return text;
      };
      _proto.codespan = function codespan(text) {
        return text;
      };
      _proto.del = function del(text) {
        return text;
      };
      _proto.html = function html(text) {
        return text;
      };
      _proto.text = function text(_text) {
        return _text;
      };
      _proto.link = function link(href, title, text) {
        return "" + text;
      };
      _proto.image = function image(href, title, text) {
        return "" + text;
      };
      _proto.br = function br() {
        return "";
      };
      return TextRenderer2;
    }();
    var Slugger_1 = /* @__PURE__ */ function() {
      function Slugger2() {
        this.seen = {};
      }
      var _proto = Slugger2.prototype;
      _proto.serialize = function serialize(value) {
        return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
      };
      _proto.getNextSafeSlug = function getNextSafeSlug(originalSlug, isDryRun) {
        var slug = originalSlug;
        var occurenceAccumulator = 0;
        if (this.seen.hasOwnProperty(slug)) {
          occurenceAccumulator = this.seen[originalSlug];
          do {
            occurenceAccumulator++;
            slug = originalSlug + "-" + occurenceAccumulator;
          } while (this.seen.hasOwnProperty(slug));
        }
        if (!isDryRun) {
          this.seen[originalSlug] = occurenceAccumulator;
          this.seen[slug] = 0;
        }
        return slug;
      };
      _proto.slug = function slug(value, options) {
        if (options === void 0) {
          options = {};
        }
        var slug2 = this.serialize(value);
        return this.getNextSafeSlug(slug2, options.dryrun);
      };
      return Slugger2;
    }();
    var Renderer$1 = Renderer_1;
    var TextRenderer$1 = TextRenderer_1;
    var Slugger$1 = Slugger_1;
    var defaults$1 = defaults$5.exports.defaults;
    var unescape = helpers.unescape;
    var Parser_1 = /* @__PURE__ */ function() {
      function Parser2(options) {
        this.options = options || defaults$1;
        this.options.renderer = this.options.renderer || new Renderer$1();
        this.renderer = this.options.renderer;
        this.renderer.options = this.options;
        this.textRenderer = new TextRenderer$1();
        this.slugger = new Slugger$1();
      }
      Parser2.parse = function parse(tokens, options) {
        var parser = new Parser2(options);
        return parser.parse(tokens);
      };
      Parser2.parseInline = function parseInline(tokens, options) {
        var parser = new Parser2(options);
        return parser.parseInline(tokens);
      };
      var _proto = Parser2.prototype;
      _proto.parse = function parse(tokens, top) {
        if (top === void 0) {
          top = true;
        }
        var out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox, ret;
        var l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call(this, token);
            if (ret !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(token.type)) {
              out += ret || "";
              continue;
            }
          }
          switch (token.type) {
            case "space": {
              continue;
            }
            case "hr": {
              out += this.renderer.hr();
              continue;
            }
            case "heading": {
              out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
              continue;
            }
            case "code": {
              out += this.renderer.code(token.text, token.lang, token.escaped);
              continue;
            }
            case "table": {
              header = "";
              cell = "";
              l2 = token.header.length;
              for (j = 0; j < l2; j++) {
                cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {
                  header: true,
                  align: token.align[j]
                });
              }
              header += this.renderer.tablerow(cell);
              body = "";
              l2 = token.cells.length;
              for (j = 0; j < l2; j++) {
                row = token.tokens.cells[j];
                cell = "";
                l3 = row.length;
                for (k = 0; k < l3; k++) {
                  cell += this.renderer.tablecell(this.parseInline(row[k]), {
                    header: false,
                    align: token.align[k]
                  });
                }
                body += this.renderer.tablerow(cell);
              }
              out += this.renderer.table(header, body);
              continue;
            }
            case "blockquote": {
              body = this.parse(token.tokens);
              out += this.renderer.blockquote(body);
              continue;
            }
            case "list": {
              ordered = token.ordered;
              start = token.start;
              loose = token.loose;
              l2 = token.items.length;
              body = "";
              for (j = 0; j < l2; j++) {
                item = token.items[j];
                checked = item.checked;
                task = item.task;
                itemBody = "";
                if (item.task) {
                  checkbox = this.renderer.checkbox(checked);
                  if (loose) {
                    if (item.tokens.length > 0 && item.tokens[0].type === "text") {
                      item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                      if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                        item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                      }
                    } else {
                      item.tokens.unshift({
                        type: "text",
                        text: checkbox
                      });
                    }
                  } else {
                    itemBody += checkbox;
                  }
                }
                itemBody += this.parse(item.tokens, loose);
                body += this.renderer.listitem(itemBody, task, checked);
              }
              out += this.renderer.list(body, ordered, start);
              continue;
            }
            case "html": {
              out += this.renderer.html(token.text);
              continue;
            }
            case "paragraph": {
              out += this.renderer.paragraph(this.parseInline(token.tokens));
              continue;
            }
            case "text": {
              body = token.tokens ? this.parseInline(token.tokens) : token.text;
              while (i + 1 < l && tokens[i + 1].type === "text") {
                token = tokens[++i];
                body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
              }
              out += top ? this.renderer.paragraph(body) : body;
              continue;
            }
            default: {
              var errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      };
      _proto.parseInline = function parseInline(tokens, renderer) {
        renderer = renderer || this.renderer;
        var out = "", i, token, ret;
        var l = tokens.length;
        for (i = 0; i < l; i++) {
          token = tokens[i];
          if (this.options.extensions && this.options.extensions.renderers && this.options.extensions.renderers[token.type]) {
            ret = this.options.extensions.renderers[token.type].call(this, token);
            if (ret !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(token.type)) {
              out += ret || "";
              continue;
            }
          }
          switch (token.type) {
            case "escape": {
              out += renderer.text(token.text);
              break;
            }
            case "html": {
              out += renderer.html(token.text);
              break;
            }
            case "link": {
              out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
              break;
            }
            case "image": {
              out += renderer.image(token.href, token.title, token.text);
              break;
            }
            case "strong": {
              out += renderer.strong(this.parseInline(token.tokens, renderer));
              break;
            }
            case "em": {
              out += renderer.em(this.parseInline(token.tokens, renderer));
              break;
            }
            case "codespan": {
              out += renderer.codespan(token.text);
              break;
            }
            case "br": {
              out += renderer.br();
              break;
            }
            case "del": {
              out += renderer.del(this.parseInline(token.tokens, renderer));
              break;
            }
            case "text": {
              out += renderer.text(token.text);
              break;
            }
            default: {
              var errMsg = 'Token with "' + token.type + '" type was not found.';
              if (this.options.silent) {
                console.error(errMsg);
                return;
              } else {
                throw new Error(errMsg);
              }
            }
          }
        }
        return out;
      };
      return Parser2;
    }();
    var Lexer = Lexer_1;
    var Parser = Parser_1;
    var Tokenizer = Tokenizer_1;
    var Renderer = Renderer_1;
    var TextRenderer = TextRenderer_1;
    var Slugger = Slugger_1;
    var merge = helpers.merge, checkSanitizeDeprecation = helpers.checkSanitizeDeprecation, escape = helpers.escape;
    var getDefaults = defaults$5.exports.getDefaults, changeDefaults = defaults$5.exports.changeDefaults, defaults = defaults$5.exports.defaults;
    function marked2(src, opt, callback) {
      if (typeof src === "undefined" || src === null) {
        throw new Error("marked(): input parameter is undefined or null");
      }
      if (typeof src !== "string") {
        throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
      }
      if (typeof opt === "function") {
        callback = opt;
        opt = null;
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      if (callback) {
        var highlight = opt.highlight;
        var tokens;
        try {
          tokens = Lexer.lex(src, opt);
        } catch (e) {
          return callback(e);
        }
        var done = function done2(err) {
          var out;
          if (!err) {
            try {
              if (opt.walkTokens) {
                marked2.walkTokens(tokens, opt.walkTokens);
              }
              out = Parser.parse(tokens, opt);
            } catch (e) {
              err = e;
            }
          }
          opt.highlight = highlight;
          return err ? callback(err) : callback(null, out);
        };
        if (!highlight || highlight.length < 3) {
          return done();
        }
        delete opt.highlight;
        if (!tokens.length)
          return done();
        var pending = 0;
        marked2.walkTokens(tokens, function(token) {
          if (token.type === "code") {
            pending++;
            setTimeout(function() {
              highlight(token.text, token.lang, function(err, code) {
                if (err) {
                  return done(err);
                }
                if (code != null && code !== token.text) {
                  token.text = code;
                  token.escaped = true;
                }
                pending--;
                if (pending === 0) {
                  done();
                }
              });
            }, 0);
          }
        });
        if (pending === 0) {
          done();
        }
        return;
      }
      try {
        var _tokens = Lexer.lex(src, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(_tokens, opt.walkTokens);
        }
        return Parser.parse(_tokens, opt);
      } catch (e) {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (opt.silent) {
          return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        }
        throw e;
      }
    }
    marked2.options = marked2.setOptions = function(opt) {
      merge(marked2.defaults, opt);
      changeDefaults(marked2.defaults);
      return marked2;
    };
    marked2.getDefaults = getDefaults;
    marked2.defaults = defaults;
    marked2.use = function() {
      var _this = this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var opts = merge.apply(void 0, [{}].concat(args));
      var extensions = marked2.defaults.extensions || {
        renderers: {},
        childTokens: {}
      };
      var hasExtensions;
      args.forEach(function(pack) {
        if (pack.extensions) {
          hasExtensions = true;
          pack.extensions.forEach(function(ext) {
            if (!ext.name) {
              throw new Error("extension name required");
            }
            if (ext.renderer) {
              var prevRenderer = extensions.renderers ? extensions.renderers[ext.name] : null;
              if (prevRenderer) {
                extensions.renderers[ext.name] = function() {
                  for (var _len2 = arguments.length, args2 = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args2[_key2] = arguments[_key2];
                  }
                  var ret = ext.renderer.apply(this, args2);
                  if (ret === false) {
                    ret = prevRenderer.apply(this, args2);
                  }
                  return ret;
                };
              } else {
                extensions.renderers[ext.name] = ext.renderer;
              }
            }
            if (ext.tokenizer) {
              if (!ext.level || ext.level !== "block" && ext.level !== "inline") {
                throw new Error("extension level must be 'block' or 'inline'");
              }
              if (extensions[ext.level]) {
                extensions[ext.level].unshift(ext.tokenizer);
              } else {
                extensions[ext.level] = [ext.tokenizer];
              }
              if (ext.start) {
                if (ext.level === "block") {
                  if (extensions.startBlock) {
                    extensions.startBlock.push(ext.start);
                  } else {
                    extensions.startBlock = [ext.start];
                  }
                } else if (ext.level === "inline") {
                  if (extensions.startInline) {
                    extensions.startInline.push(ext.start);
                  } else {
                    extensions.startInline = [ext.start];
                  }
                }
              }
            }
            if (ext.childTokens) {
              extensions.childTokens[ext.name] = ext.childTokens;
            }
          });
        }
        if (pack.renderer) {
          (function() {
            var renderer = marked2.defaults.renderer || new Renderer();
            var _loop = function _loop2(prop2) {
              var prevRenderer = renderer[prop2];
              renderer[prop2] = function() {
                for (var _len3 = arguments.length, args2 = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
                  args2[_key3] = arguments[_key3];
                }
                var ret = pack.renderer[prop2].apply(renderer, args2);
                if (ret === false) {
                  ret = prevRenderer.apply(renderer, args2);
                }
                return ret;
              };
            };
            for (var prop in pack.renderer) {
              _loop(prop);
            }
            opts.renderer = renderer;
          })();
        }
        if (pack.tokenizer) {
          (function() {
            var tokenizer = marked2.defaults.tokenizer || new Tokenizer();
            var _loop2 = function _loop22(prop2) {
              var prevTokenizer = tokenizer[prop2];
              tokenizer[prop2] = function() {
                for (var _len4 = arguments.length, args2 = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
                  args2[_key4] = arguments[_key4];
                }
                var ret = pack.tokenizer[prop2].apply(tokenizer, args2);
                if (ret === false) {
                  ret = prevTokenizer.apply(tokenizer, args2);
                }
                return ret;
              };
            };
            for (var prop in pack.tokenizer) {
              _loop2(prop);
            }
            opts.tokenizer = tokenizer;
          })();
        }
        if (pack.walkTokens) {
          var walkTokens = marked2.defaults.walkTokens;
          opts.walkTokens = function(token) {
            pack.walkTokens.call(_this, token);
            if (walkTokens) {
              walkTokens(token);
            }
          };
        }
        if (hasExtensions) {
          opts.extensions = extensions;
        }
        marked2.setOptions(opts);
      });
    };
    marked2.walkTokens = function(tokens, callback) {
      var _loop3 = function _loop32() {
        var token = _step.value;
        callback(token);
        switch (token.type) {
          case "table": {
            for (var _iterator2 = _createForOfIteratorHelperLoose(token.tokens.header), _step2; !(_step2 = _iterator2()).done; ) {
              var cell = _step2.value;
              marked2.walkTokens(cell, callback);
            }
            for (var _iterator3 = _createForOfIteratorHelperLoose(token.tokens.cells), _step3; !(_step3 = _iterator3()).done; ) {
              var row = _step3.value;
              for (var _iterator4 = _createForOfIteratorHelperLoose(row), _step4; !(_step4 = _iterator4()).done; ) {
                var _cell = _step4.value;
                marked2.walkTokens(_cell, callback);
              }
            }
            break;
          }
          case "list": {
            marked2.walkTokens(token.items, callback);
            break;
          }
          default: {
            if (marked2.defaults.extensions && marked2.defaults.extensions.childTokens && marked2.defaults.extensions.childTokens[token.type]) {
              marked2.defaults.extensions.childTokens[token.type].forEach(function(childTokens) {
                marked2.walkTokens(token[childTokens], callback);
              });
            } else if (token.tokens) {
              marked2.walkTokens(token.tokens, callback);
            }
          }
        }
      };
      for (var _iterator = _createForOfIteratorHelperLoose(tokens), _step; !(_step = _iterator()).done; ) {
        _loop3();
      }
    };
    marked2.parseInline = function(src, opt) {
      if (typeof src === "undefined" || src === null) {
        throw new Error("marked.parseInline(): input parameter is undefined or null");
      }
      if (typeof src !== "string") {
        throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
      }
      opt = merge({}, marked2.defaults, opt || {});
      checkSanitizeDeprecation(opt);
      try {
        var tokens = Lexer.lexInline(src, opt);
        if (opt.walkTokens) {
          marked2.walkTokens(tokens, opt.walkTokens);
        }
        return Parser.parseInline(tokens, opt);
      } catch (e) {
        e.message += "\nPlease report this to https://github.com/markedjs/marked.";
        if (opt.silent) {
          return "<p>An error occurred:</p><pre>" + escape(e.message + "", true) + "</pre>";
        }
        throw e;
      }
    };
    marked2.Parser = Parser;
    marked2.parser = Parser.parse;
    marked2.Renderer = Renderer;
    marked2.TextRenderer = TextRenderer;
    marked2.Lexer = Lexer;
    marked2.lexer = Lexer.lex;
    marked2.Tokenizer = Tokenizer;
    marked2.Slugger = Slugger;
    marked2.parse = marked2;
    var marked_1 = marked2;
    return marked_1;
  });
})(marked$1);
var marked = marked$1.exports;
var toggleSelection = function() {
  var selection = document.getSelection();
  if (!selection.rangeCount) {
    return function() {
    };
  }
  var active = document.activeElement;
  var ranges = [];
  for (var i = 0; i < selection.rangeCount; i++) {
    ranges.push(selection.getRangeAt(i));
  }
  switch (active.tagName.toUpperCase()) {
    case "INPUT":
    case "TEXTAREA":
      active.blur();
      break;
    default:
      active = null;
      break;
  }
  selection.removeAllRanges();
  return function() {
    selection.type === "Caret" && selection.removeAllRanges();
    if (!selection.rangeCount) {
      ranges.forEach(function(range) {
        selection.addRange(range);
      });
    }
    active && active.focus();
  };
};
var deselectCurrent = toggleSelection;
var clipboardToIE11Formatting = {
  "text/plain": "Text",
  "text/html": "Url",
  "default": "Text"
};
var defaultMessage = "Copy to clipboard: #{key}, Enter";
function format(message) {
  var copyKey = (/mac os x/i.test(navigator.userAgent) ? "\u2318" : "Ctrl") + "+C";
  return message.replace(/#{\s*key\s*}/g, copyKey);
}
function copy(text, options) {
  var debug, message, reselectPrevious, range, selection, mark, success = false;
  if (!options) {
    options = {};
  }
  debug = options.debug || false;
  try {
    reselectPrevious = deselectCurrent();
    range = document.createRange();
    selection = document.getSelection();
    mark = document.createElement("span");
    mark.textContent = text;
    mark.style.all = "unset";
    mark.style.position = "fixed";
    mark.style.top = 0;
    mark.style.clip = "rect(0, 0, 0, 0)";
    mark.style.whiteSpace = "pre";
    mark.style.webkitUserSelect = "text";
    mark.style.MozUserSelect = "text";
    mark.style.msUserSelect = "text";
    mark.style.userSelect = "text";
    mark.addEventListener("copy", function(e) {
      e.stopPropagation();
      if (options.format) {
        e.preventDefault();
        if (typeof e.clipboardData === "undefined") {
          debug && console.warn("unable to use e.clipboardData");
          debug && console.warn("trying IE specific stuff");
          window.clipboardData.clearData();
          var format2 = clipboardToIE11Formatting[options.format] || clipboardToIE11Formatting["default"];
          window.clipboardData.setData(format2, text);
        } else {
          e.clipboardData.clearData();
          e.clipboardData.setData(options.format, text);
        }
      }
      if (options.onCopy) {
        e.preventDefault();
        options.onCopy(e.clipboardData);
      }
    });
    document.body.appendChild(mark);
    range.selectNodeContents(mark);
    selection.addRange(range);
    var successful = document.execCommand("copy");
    if (!successful) {
      throw new Error("copy command was unsuccessful");
    }
    success = true;
  } catch (err) {
    debug && console.error("unable to copy using execCommand: ", err);
    debug && console.warn("trying IE specific stuff");
    try {
      window.clipboardData.setData(options.format || "text", text);
      options.onCopy && options.onCopy(window.clipboardData);
      success = true;
    } catch (err2) {
      debug && console.error("unable to copy using clipboardData: ", err2);
      debug && console.error("falling back to prompt");
      message = format("message" in options ? options.message : defaultMessage);
      window.prompt(message, text);
    }
  } finally {
    if (selection) {
      if (typeof selection.removeRange == "function") {
        selection.removeRange(range);
      } else {
        selection.removeAllRanges();
      }
    }
    if (mark) {
      document.body.removeChild(mark);
    }
    reselectPrevious();
  }
  return success;
}
var copyToClipboard = copy;
const splitHelp = (textarea) => {
  const text = textarea.value;
  const prefixStr = text.substring(0, textarea.selectionStart);
  const subfixStr = text.substring(textarea.selectionEnd, text.length);
  const prefixStrIndexOfLineCode = prefixStr.lastIndexOf("\n");
  const prefixStrEndRow = prefixStr.substring(0, prefixStrIndexOfLineCode + 1);
  const subfixStrIndexOfLineCode = subfixStr.indexOf("\n");
  const subfixStrEndRow = subfixStr.substring(subfixStrIndexOfLineCode === -1 ? subfixStr.length : subfixStrIndexOfLineCode, subfixStr.length);
  const prefixSupply = prefixStr.substring(prefixStrIndexOfLineCode + 1, prefixStr.length);
  const subfixSupply = subfixStr.substring(0, subfixStrIndexOfLineCode);
  return {
    prefixStr,
    subfixStr,
    prefixStrEndRow,
    subfixStrEndRow,
    prefixSupply,
    subfixSupply
  };
};
const directive2flag = (direct, selectedText = "", inputArea, params = {}) => {
  var _a, _b;
  let targetValue = "";
  let deviationStart = 0;
  let deviationEnd = 0;
  let select = false;
  let prefixVal;
  let subfixVal;
  if (/^h[1-6]{1}$/.test(direct)) {
    const pix = direct.replace(/^h(\d)/, (_, num) => {
      return new Array(Number(num)).fill("#", 0, num).join("");
    });
    targetValue = `${pix} ${selectedText}`;
    deviationStart = pix.length + 1;
  } else if (direct === "prettier") {
    return window.prettier.format(inputArea.value, {
      parser: "markdown",
      plugins: window.prettierPlugins
    });
  } else {
    switch (direct) {
      case "bold": {
        targetValue = `**${selectedText}**`;
        deviationStart = 2;
        deviationEnd = -2;
        break;
      }
      case "underline": {
        targetValue = `<u>${selectedText}</u>`;
        deviationStart = 3;
        deviationEnd = -4;
        break;
      }
      case "italic": {
        targetValue = `*${selectedText}*`;
        deviationStart = 1;
        deviationEnd = -1;
        break;
      }
      case "strikeThrough": {
        targetValue = `~${selectedText}~`;
        deviationStart = 1;
        deviationEnd = -1;
        break;
      }
      case "sub": {
        targetValue = `<sub>${selectedText}</sub>`;
        deviationStart = 5;
        deviationEnd = -6;
        break;
      }
      case "sup": {
        targetValue = `<sup>${selectedText}</sup>`;
        deviationStart = 5;
        deviationEnd = -6;
        break;
      }
      case "codeRow": {
        targetValue = "`" + selectedText + "`";
        deviationStart = 1;
        deviationEnd = -1;
        break;
      }
      case "quote": {
        targetValue = `> ${selectedText}`;
        deviationStart = 2;
        break;
      }
      case "orderedList": {
        targetValue = `1. ${selectedText}`;
        deviationStart = 3;
        break;
      }
      case "unorderedList": {
        targetValue = `- ${selectedText}`;
        deviationStart = 2;
        break;
      }
      case "code": {
        targetValue = "```language\n" + selectedText + "\n```\n";
        deviationStart = 3;
        deviationEnd = 11 - targetValue.length;
        select = true;
        break;
      }
      case "table": {
        targetValue = "| \u8868\u5934 | \u8868\u5934 |\n| - | - |\n| \u5185\u5BB9 | \u5185\u5BB9 |\n";
        deviationStart = 2;
        deviationEnd = 4 - targetValue.length;
        select = true;
        break;
      }
      case "link": {
        const { desc, url } = params;
        targetValue = `[${desc}](${url})`;
        break;
      }
      case "image": {
        const { desc, url } = params;
        targetValue = `![${desc}](${url})
`;
        break;
      }
      case "tab": {
        selectedText = ((_a = window.getSelection()) == null ? void 0 : _a.toString()) || "";
        const { tabWidth = 2 } = params;
        const retract = new Array(tabWidth).fill(" ").join("");
        if (selectedText === "") {
          targetValue = retract;
        } else if (/\n/.test(selectedText)) {
          const { prefixStr, subfixStr, prefixSupply, subfixSupply } = splitHelp(inputArea);
          const str2adjust = `${prefixSupply}${selectedText}${subfixSupply}`;
          const str2AdjustRows = str2adjust.split("\n");
          targetValue = str2AdjustRows.map((strItem) => {
            return `${retract}${strItem}`;
          }).join("\n");
          prefixVal = prefixStr.substring(0, prefixStr.length - prefixSupply.length);
          subfixVal = subfixStr.substring(subfixSupply.length, subfixStr.length);
          select = true;
          deviationStart = tabWidth;
          deviationEnd = -prefixSupply.length - subfixSupply.length;
        } else {
          const mdText = inputArea.value;
          const prefixStr = mdText.substring(0, inputArea.selectionStart);
          if (/\n$/.test(prefixStr) || prefixStr === "") {
            targetValue = `${retract}${selectedText}`;
            select = true;
          } else {
            targetValue = retract;
          }
        }
        break;
      }
      case "shiftTab": {
        selectedText = ((_b = window.getSelection()) == null ? void 0 : _b.toString()) || "";
        const { tabWidth = 2 } = params;
        const {
          prefixStr,
          prefixStrEndRow,
          subfixStrEndRow,
          prefixSupply,
          subfixSupply
        } = splitHelp(inputArea);
        const normalReg = new RegExp(`^\\s{${tabWidth}}`);
        const notMultiRow = (selected = false, row = false) => {
          const str2adjust = `${prefixSupply}${selectedText}${subfixSupply}`;
          if (normalReg.test(str2adjust)) {
            const startPos = prefixStr.length - (row ? 0 : tabWidth);
            const endPos = selected ? startPos + selectedText.length - tabWidth : startPos;
            setPosition(inputArea, startPos, endPos);
            return `${prefixStrEndRow}${str2adjust.replace(normalReg, "")}${subfixStrEndRow}`;
          } else if (/^\s/.test(str2adjust)) {
            const deletedTabStr = str2adjust.replace(/^\s/, "");
            const deletedLength = str2adjust.length - deletedTabStr.length;
            const startPos = inputArea.selectionStart - (row ? 0 : deletedLength);
            const endPos = selected ? startPos + selectedText.length - deletedLength : startPos;
            setPosition(inputArea, startPos, endPos);
            return `${prefixStrEndRow}${deletedTabStr}${subfixStrEndRow}`;
          } else {
            targetValue = selectedText;
          }
        };
        if (selectedText === "") {
          const newContent = notMultiRow();
          if (newContent) {
            return newContent;
          }
        } else if (/\n/.test(selectedText)) {
          const str2adjust = `${prefixSupply}${selectedText}${subfixSupply}`;
          const str2AdjustRows = str2adjust.split("\n");
          let [firstRowDelNum, totalRowDelNum] = [0, 0];
          const str2AdjustRowsMod = str2AdjustRows.map((strItem, index2) => {
            if (normalReg.test(strItem)) {
              if (index2 === 0) {
                firstRowDelNum = tabWidth;
              }
              totalRowDelNum += tabWidth;
              return strItem.replace(normalReg, "");
            } else if (/^\s/.test(strItem)) {
              const deletedTabStr = strItem.replace(/^\s/, "");
              totalRowDelNum += strItem.length - deletedTabStr.length;
              return deletedTabStr;
            }
            return strItem;
          }).join("\n");
          setPosition(inputArea, inputArea.selectionStart - firstRowDelNum, inputArea.selectionEnd - totalRowDelNum);
          return `${prefixStrEndRow}${str2AdjustRowsMod}${subfixStrEndRow}`;
        } else {
          const newContent = notMultiRow(true, true);
          if (newContent) {
            return newContent;
          }
        }
        break;
      }
      case "ctrlC": {
        const { prefixSupply, subfixSupply } = splitHelp(inputArea);
        if (selectedText === "") {
          copyToClipboard(`${prefixSupply}${subfixSupply}`);
        } else {
          copyToClipboard(selectedText);
        }
        return inputArea.value;
      }
      case "ctrlX": {
        const {
          prefixStrEndRow,
          subfixStrEndRow,
          prefixStr,
          subfixStr,
          prefixSupply,
          subfixSupply
        } = splitHelp(inputArea);
        if (selectedText === "") {
          copyToClipboard(`${prefixSupply}${subfixSupply}`);
          setPosition(inputArea, prefixStrEndRow.length);
          return `${prefixStrEndRow}${subfixStrEndRow.replace(/^\n/, "")}`;
        } else {
          copyToClipboard(selectedText);
          setPosition(inputArea, prefixStr.length);
          return `${prefixStr}${subfixStr}`;
        }
      }
      case "ctrlD": {
        const { prefixStrEndRow, subfixStrEndRow } = splitHelp(inputArea);
        setPosition(inputArea, prefixStrEndRow.length);
        return `${prefixStrEndRow}${subfixStrEndRow.replace(/^\n/, "")}`;
      }
    }
  }
  return insert(inputArea, targetValue, {
    deviationStart,
    deviationEnd,
    select,
    prefixVal,
    subfixVal
  });
};
let saveHistoryId = -1;
const useHistory = (props, textAreaRef) => {
  const { onChange } = props;
  const { historyLength, editorId } = useContext(EditorContext);
  const [history, setHistory] = useState({
    list: [],
    userUpdated: true,
    curr: 0
  });
  useEffect(() => {
    var _a, _b;
    clearTimeout(saveHistoryId);
    const startPos = ((_a = textAreaRef.current) == null ? void 0 : _a.selectionStart) || 0;
    const endPos = ((_b = textAreaRef.current) == null ? void 0 : _b.selectionEnd) || 0;
    saveHistoryId = window.setTimeout(() => {
      if (history.userUpdated) {
        if (history.curr < history.list.length - 1) {
          history.list = history.list.slice(0, history.curr + 1);
        }
        if (history.list.length > historyLength) {
          history.list.shift();
        }
        const lastStep = history.list.pop() || {
          startPos: 0,
          endPos: 0,
          content: props.value
        };
        lastStep.startPos = startPos;
        lastStep.endPos = endPos;
        Array.prototype.push.call(history.list, lastStep, {
          content: props.value,
          startPos,
          endPos
        });
        history.curr = history.list.length - 1;
      } else {
        setHistory(__spreadProps(__spreadValues({}, history), {
          userUpdated: true
        }));
      }
    }, 10);
  }, [props.value]);
  useEffect(() => {
    bus.on(editorId, {
      name: "ctrlZ",
      callback() {
        setHistory(__spreadProps(__spreadValues({}, history), {
          userUpdated: false
        }));
        history.curr = history.curr - 1 < 0 ? 0 : history.curr - 1;
        const currHistory = history.list[history.curr];
        onChange(currHistory.content);
        setPosition(textAreaRef.current, currHistory.startPos, currHistory.endPos);
      }
    });
    bus.on(editorId, {
      name: "ctrlShiftZ",
      callback() {
        setHistory(__spreadProps(__spreadValues({}, history), {
          userUpdated: false
        }));
        history.curr = history.curr + 1 === history.list.length ? history.curr : history.curr + 1;
        const currHistory = history.list[history.curr];
        onChange(currHistory.content);
        setPosition(textAreaRef.current, currHistory.startPos, currHistory.endPos);
      }
    });
  }, []);
};
const useAutoGenrator = (props, textAreaRef) => {
  const selectedText = useRef("");
  const { previewOnly, tabWidth, editorId } = useContext(EditorContext);
  useEffect(() => {
    var _a, _b;
    if (!previewOnly) {
      (_a = textAreaRef.current) == null ? void 0 : _a.addEventListener("select", () => {
        var _a2;
        selectedText.current = ((_a2 = window.getSelection()) == null ? void 0 : _a2.toString()) || "";
      });
      (_b = textAreaRef.current) == null ? void 0 : _b.addEventListener("keypress", (event) => {
        var _a2, _b2, _c;
        if (event.key === "Enter") {
          const endPoint = (_a2 = textAreaRef.current) == null ? void 0 : _a2.selectionStart;
          const prefixStr = (_b2 = textAreaRef.current) == null ? void 0 : _b2.value.substring(0, endPoint);
          const subStr = (_c = textAreaRef.current) == null ? void 0 : _c.value.substring(endPoint);
          const lastIndexBR = prefixStr == null ? void 0 : prefixStr.lastIndexOf("\n");
          const enterPressRow = prefixStr == null ? void 0 : prefixStr.substring(lastIndexBR + 1, endPoint);
          if (/^\d+\.\s|^-\s/.test(enterPressRow)) {
            event.cancelBubble = true;
            event.preventDefault();
            event.stopPropagation();
            if (/^\d+\.\s+$|^-\s+$/.test(enterPressRow)) {
              const resetPrefixStr = prefixStr == null ? void 0 : prefixStr.replace(new RegExp(enterPressRow + "$"), "");
              props.onChange(resetPrefixStr + subStr);
              setPosition(textAreaRef.current, resetPrefixStr == null ? void 0 : resetPrefixStr.length);
            } else if (/^-\s+.+/.test(enterPressRow)) {
              props.onChange(insert(textAreaRef.current, "\n- ", {}));
            } else {
              const lastOrderMatch = enterPressRow == null ? void 0 : enterPressRow.match(/\d+(?=\.)/);
              const nextOrder = lastOrderMatch && Number(lastOrderMatch[0]) + 1 || 1;
              props.onChange(insert(textAreaRef.current, `
${nextOrder}. `, {}));
            }
          }
        }
      });
      bus.on(editorId, {
        name: "selectTextChange",
        callback(val) {
          selectedText.current = val;
        }
      });
    }
  }, []);
  const replaceCallBack = useCallback((direct, params = {}) => {
    props.onChange(directive2flag(direct, selectedText.current, textAreaRef.current, __spreadProps(__spreadValues({}, params), {
      tabWidth
    })));
  }, [textAreaRef]);
  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, "replace", replaceCallBack);
      bus.on(editorId, {
        name: "replace",
        callback: replaceCallBack
      });
    }
  }, [textAreaRef]);
  return {
    selectedText
  };
};
let clearScrollAuto = () => {
};
const Content = (props) => {
  const {
    hljs = null,
    highlightSet,
    onChange = () => {
    },
    onHtmlChanged = () => {
    },
    onGetCatalog = () => {
    }
  } = props;
  const { editorId, previewOnly, usedLanguageText, previewTheme, showCodeRowNumber } = useContext(EditorContext);
  const [highlightInited, setHighlightInited] = useState(hljs !== null);
  const textAreaRef = useRef(null);
  const selectedText = useRef("");
  const previewRef = useRef(null);
  const htmlRef = useRef(null);
  const headstemp = [];
  const renderer = new marked.Renderer();
  renderer.heading = (...headProps) => {
    const [text, level] = headProps;
    headstemp.push({ text, level });
    return props.markedHeading(...headProps);
  };
  renderer.image = (href, _, desc) => {
    return `<figure><img src="${href}" alt="${desc}"><figcaption>${desc}</figcaption></figure>`;
  };
  marked.setOptions({
    renderer
  });
  const initCopyEntry = () => {
    document.querySelectorAll(`#${editorId} .${prefix}-preview pre`).forEach((pre) => {
      var _a;
      const copyButton = document.createElement("span");
      copyButton.setAttribute("class", "copy-button");
      copyButton.innerText = ((_a = usedLanguageText.copyCode) == null ? void 0 : _a.text) || "\u590D\u5236\u4EE3\u7801";
      copyButton.addEventListener("click", () => {
        var _a2;
        copyToClipboard(pre.querySelector("code").innerText);
        copyButton.innerText = ((_a2 = usedLanguageText.copyCode) == null ? void 0 : _a2.tips) || "\u5DF2\u590D\u5236\uFF01";
        setTimeout(() => {
          var _a3;
          copyButton.innerText = ((_a3 = usedLanguageText.copyCode) == null ? void 0 : _a3.text) || "\u590D\u5236\u4EE3\u7801";
        }, 1500);
      });
      pre.appendChild(copyButton);
    });
  };
  const highlightLoad = () => {
    marked.setOptions({
      highlight(code) {
        const codeHtml = window.hljs.highlightAuto(code).value;
        return showCodeRowNumber ? generateCodeRowNumber(codeHtml) : `<span class="code-block">${codeHtml}</span>`;
      }
    });
    setHighlightInited(true);
  };
  useEffect(() => {
    let highlightLink;
    let highlightScript;
    if (props.hljs) {
      marked.setOptions({
        highlight: (code) => {
          var _a;
          const codeHtml = (_a = props.hljs) == null ? void 0 : _a.highlightAuto(code).value;
          return showCodeRowNumber ? generateCodeRowNumber(codeHtml) : `<span class="code-block">${codeHtml}</span>`;
        }
      });
    } else {
      highlightLink = document.createElement("link");
      highlightLink.rel = "stylesheet";
      highlightLink.href = highlightSet.css;
      highlightLink.id = `${prefix}-hlCss`;
      highlightScript = document.createElement("script");
      highlightScript.src = highlightSet.js;
      highlightScript.onload = highlightLoad;
      highlightScript.id = `${prefix}-hljs`;
      appendHandler(highlightLink);
      appendHandler(highlightScript);
    }
    return () => {
      if (!props.hljs) {
        document.head.removeChild(highlightLink);
        document.head.removeChild(highlightScript);
      }
    };
  }, []);
  const html = useMemo(() => {
    return marked(props.value);
  }, [props.value, highlightInited]);
  useEffect(() => {
    onHtmlChanged(html);
    onGetCatalog(headstemp);
    if (props.setting.preview && !previewOnly) {
      clearScrollAuto = scrollAuto(textAreaRef.current, previewRef.current || htmlRef.current);
    }
    initCopyEntry();
  }, [html]);
  useEffect(() => {
    if (props.setting.preview && !previewOnly) {
      clearScrollAuto = scrollAuto(textAreaRef.current, previewRef.current || htmlRef.current);
    } else {
      clearScrollAuto();
    }
  }, [props.setting.preview]);
  useHistory(props, textAreaRef);
  useAutoGenrator(props, textAreaRef);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-content`
  }, !previewOnly && /* @__PURE__ */ React.createElement("div", {
    className: `${prefix}-input-wrapper`
  }, /* @__PURE__ */ React.createElement("textarea", {
    id: `${editorId}-textarea`,
    ref: textAreaRef,
    value: props.value,
    onInput: (e) => {
      selectedText.current = "";
      onChange(e.target.value);
    },
    className: props.setting.preview || props.setting.htmlPreview ? "" : "textarea-only"
  })), props.setting.preview && /* @__PURE__ */ React.createElement("div", {
    ref: previewRef,
    className: cn(`${prefix}-preview`, `${previewTheme}-theme`, showCodeRowNumber && `${prefix}-scrn`),
    dangerouslySetInnerHTML: { __html: html }
  }), props.setting.htmlPreview && /* @__PURE__ */ React.createElement("div", {
    ref: htmlRef,
    className: `${prefix}-html`
  }, html)));
};
var index = "";
var all = "";
const EditorContext = createContext({
  editorId: "",
  tabWidth: 2,
  historyLength: 10,
  previewOnly: false,
  showCodeRowNumber: false,
  usedLanguageText: staticTextDefault["zh-CN"],
  Cropper: null,
  previewTheme: "default"
});
let bodyOverflowHistory = "";
const Editor = (props) => {
  const {
    theme,
    editorClass,
    toolbars,
    toolbarsExclude,
    preview,
    htmlPreview,
    previewOnly,
    pageFullScreen,
    editorId,
    tabWidth,
    screenfull,
    screenfullJs
  } = props;
  useKeyBoard(props);
  useExpansion(props);
  const [setting, setSetting] = useState({
    pageFullScreen,
    fullscreen: false,
    preview,
    htmlPreview: preview ? false : htmlPreview
  });
  const updateSetting = (v, k) => {
    setSetting((settingN) => {
      const nextSetting = __spreadProps(__spreadValues({}, settingN), {
        [k]: v
      });
      if (k === "preview" && nextSetting.preview) {
        nextSetting.htmlPreview = false;
      } else if (k === "htmlPreview" && nextSetting.htmlPreview) {
        nextSetting.preview = false;
      }
      return nextSetting;
    });
  };
  const uploadImageCallBack = useCallback((files, cb) => {
    const insertHanlder = (urls) => {
      urls.forEach((url) => {
        setTimeout(() => {
          bus.emit(editorId, "replace", "image", {
            desc: "",
            url
          });
        }, 0);
      });
      cb && cb();
    };
    if (props.onUploadImg) {
      props.onUploadImg(files, insertHanlder);
    }
  }, []);
  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, "uploadImage", uploadImageCallBack);
      bus.on(editorId, {
        name: "uploadImage",
        callback: uploadImageCallBack
      });
      bodyOverflowHistory = document.body.style.overflow;
    }
  }, []);
  useEffect(() => {
    if (setting.pageFullScreen || setting.fullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = bodyOverflowHistory;
    }
  }, [setting.pageFullScreen, setting.fullscreen]);
  const highlightSet = useMemo(() => {
    let url = highlightUrl.atom;
    if (props.highlightCss) {
      url = props.highlightCss;
    } else {
      switch (props.previewTheme) {
        case "github": {
          if (props.theme === "dark") {
            url = highlightUrl.githubDark;
          } else {
            url = highlightUrl.github;
          }
          break;
        }
      }
    }
    return {
      js: props.highlightJs,
      css: url
    };
  }, [props.highlightCss, props.previewTheme, props.theme]);
  const usedLanguageText = useMemo(() => {
    const allText = __spreadValues(__spreadValues({}, staticTextDefault), props.languageUserDefined);
    if (allText[props.language]) {
      return allText[props.language];
    } else {
      return staticTextDefault["zh-CN"];
    }
  }, [props.languageUserDefined, props.language]);
  return /* @__PURE__ */ React.createElement(EditorContext.Provider, {
    value: {
      editorId,
      tabWidth,
      historyLength: props.historyLength,
      previewOnly,
      showCodeRowNumber: props.showCodeRowNumber,
      usedLanguageText,
      Cropper: props.Cropper,
      previewTheme: props.previewTheme
    }
  }, /* @__PURE__ */ React.createElement("div", {
    id: editorId,
    className: cn([
      prefix,
      editorClass,
      theme === "dark" && `${prefix}-dark`,
      setting.fullscreen || setting.pageFullScreen ? `${prefix}-fullscreen` : "",
      previewOnly && `${prefix}-previewOnly`
    ])
  }, !previewOnly && /* @__PURE__ */ React.createElement(Toolbar, {
    prettier: props.prettier,
    screenfull,
    screenfullJs,
    toolbars,
    toolbarsExclude,
    setting,
    updateSetting
  }), /* @__PURE__ */ React.createElement(Content, {
    hljs: props.hljs,
    highlightSet,
    value: props.modelValue,
    onChange: props.onChange,
    setting,
    onHtmlChanged: props.onHtmlChanged,
    onGetCatalog: props.onGetCatalog,
    markedHeading: props.markedHeading
  })));
};
Editor.defaultProps = {
  modelValue: "",
  theme: "light",
  editorClass: "",
  highlightJs: highlightUrl.js,
  highlightCss: "",
  historyLength: 10,
  onChange() {
  },
  pageFullScreen: false,
  preview: true,
  htmlPreview: false,
  previewOnly: false,
  language: "zh-CN",
  languageUserDefined: {},
  toolbars: allToolbar,
  toolbarsExclude: [],
  prettier: true,
  prettierCDN: prettierUrl.main,
  prettierMDCDN: prettierUrl.markdown,
  cropperCss: cropperUrl.css,
  cropperJs: cropperUrl.js,
  iconfontJs: iconfontUrl,
  editorId: `mev-${Math.random().toString(36).substr(3)}`,
  tabWidth: 2,
  showCodeRowNumber: false,
  screenfullJs: screenfullUrl,
  previewTheme: "default",
  markedHeading: (text, level) => `<h${level} id="${text}"><a href="#${text}">${text}</a></h${level}>`
};
export { EditorContext, Editor as default };
