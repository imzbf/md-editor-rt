import { CSSProperties, useCallback, useEffect, useMemo, useState } from 'react';
import bus from './utils/event-bus';
import { ToolDirective } from './utils/content-help';
import { EditorProp, InnerError, SettingType, ToolbarNames } from './type';
import {
  prefix,
  iconfontUrl,
  prettierUrl,
  cropperUrl,
  defaultEditorId,
  allToolbar,
  codeCss,
  highlightUrl,
  staticTextDefault,
  configOption
} from './config';
import { appendHandler } from './utils/dom';

/**
 * 键盘监听
 *
 * @param props
 */
export const useKeyBoard = (props: EditorProp) => {
  const { editorId = defaultEditorId, noPrettier } = props;

  const initFunc = (name: ToolbarNames) =>
    props.toolbars?.includes(name) &&
    !props.toolbarsExclude?.includes(name) &&
    !noPrettier;

  const keyDownHandler = (event: KeyboardEvent) => {
    // 只处理是编辑框内的内容
    if (event.target !== document.querySelector(`#${editorId}-textarea`)) {
      return;
    }

    // 使用快捷键时，保存选中文本
    bus.emit(editorId, 'selectTextChange');

    // macos中以meta键位配s键位为保存，windows中如此会被系统默认的事件替代
    if (event.ctrlKey || event.metaKey) {
      switch (event.code) {
        case 'KeyS': {
          if (event.shiftKey) {
            // 删除线
            if (initFunc('strikeThrough')) {
              bus.emit(editorId, 'replace', 'strikeThrough' as ToolDirective);
            }
          } else {
            // 触发保存事件
            if (initFunc('save')) {
              bus.emit(editorId, 'onSave', props.modelValue);
              event.preventDefault();
            }
          }
          break;
        }
        case 'KeyB': {
          if (initFunc('bold')) {
            bus.emit(editorId, 'replace', 'bold' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'KeyU': {
          if (event.shiftKey) {
            // ctrl+shift+u触发无需列表
            if (initFunc('unorderedList')) {
              bus.emit(editorId, 'replace', 'unorderedList' as ToolDirective);
              event.preventDefault();
            }
          } else {
            // ctrl+u触发下划线
            if (initFunc('underline')) {
              bus.emit(editorId, 'replace', 'underline' as ToolDirective);
              event.preventDefault();
            }
          }

          break;
        }
        case 'KeyI': {
          if (event.shiftKey) {
            // ctrl+shift+l触发图片链接
            if (initFunc('image')) {
              bus.emit(editorId, 'openModals', 'image');
              event.preventDefault();
            }
          } else {
            if (initFunc('italic')) {
              bus.emit(editorId, 'replace', 'italic' as ToolDirective);
              event.preventDefault();
            }
          }

          break;
        }
        case 'Digit1': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h1' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'Digit2': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h2' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'Digit3': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h3' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'Digit4': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h4' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'Digit5': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h5' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'Digit6': {
          if (initFunc('title')) {
            bus.emit(editorId, 'replace', 'h6' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'ArrowUp': {
          if (initFunc('sup')) {
            bus.emit(editorId, 'replace', 'sup' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'ArrowDown': {
          if (initFunc('sub')) {
            bus.emit(editorId, 'replace', 'sub' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'KeyQ': {
          if (event.key === 'a') {
            (event.target as HTMLTextAreaElement).select();
            return;
          }

          bus.emit(editorId, 'replace', 'quote' as ToolDirective);
          event.preventDefault();
          break;
        }
        case 'KeyA': {
          if (event.key === 'q') {
            bus.emit(editorId, 'replace', 'quote' as ToolDirective);
            event.preventDefault();
            break;
          } else {
            return;
          }
        }
        case 'KeyO': {
          if (initFunc('orderedList')) {
            bus.emit(editorId, 'replace', 'orderedList' as ToolDirective);
            event.preventDefault();
          }
          break;
        }
        case 'KeyC': {
          if (event.shiftKey) {
            // ctrl+shift+c触发块级代码
            if (initFunc('code')) {
              bus.emit(editorId, 'replace', 'code' as ToolDirective);
              event.preventDefault();
            }
          } else if (event.altKey) {
            // ctrl+alt+c触发行内代码
            if (initFunc('codeRow')) {
              bus.emit(editorId, 'replace', 'codeRow' as ToolDirective);
              event.preventDefault();
            }
          } else {
            // 接管复制快捷键
            event.preventDefault();
            bus.emit(editorId, 'replace', 'ctrlC');
            break;
          }
          break;
        }
        case 'KeyL': {
          // ctrl+l触发普通链接
          if (initFunc('link')) {
            bus.emit(editorId, 'openModals', 'link');
            event.preventDefault();
          }
          break;
        }
        case 'KeyZ': {
          if (event.key === 'w') {
            return;
          }

          if (event.shiftKey) {
            // ctrl+shift+z 前进一步
            if (initFunc('next')) {
              bus.emit(editorId, 'ctrlShiftZ');
              event.preventDefault();
            }
          } else {
            // ctrl+z 后退一步
            if (initFunc('revoke')) {
              bus.emit(editorId, 'ctrlZ');
              event.preventDefault();
            }
          }

          break;
        }
        case 'KeyW': {
          if (event.key === 'z') {
            if (event.shiftKey) {
              // ctrl+shift+z 前进一步
              if (initFunc('next')) {
                bus.emit(editorId, 'ctrlShiftZ');
                event.preventDefault();
              }
            } else {
              // ctrl+z 后退一步
              if (initFunc('revoke')) {
                bus.emit(editorId, 'ctrlZ');
                event.preventDefault();
              }
            }

            break;
          } else {
            return;
          }
        }
        case 'KeyF': {
          // ctrl+shift+f 美化内容
          if (event.shiftKey) {
            if (initFunc('prettier')) {
              bus.emit(editorId, 'replace', 'prettier');
              event.preventDefault();
            }
          }
          break;
        }
        case 'KeyT': {
          // ctrl+shift+alt+t 新增表格
          if (event.altKey && event.shiftKey) {
            if (initFunc('table')) {
              bus.emit(editorId, 'replace', 'table');
              event.preventDefault();
            }
          }
          break;
        }
        case 'KeyX': {
          bus.emit(editorId, 'replace', 'ctrlX');
          event.preventDefault();
          break;
        }
        case 'KeyD': {
          event.preventDefault();
          bus.emit(editorId, 'replace', 'ctrlD');
          break;
        }
      }
    } else if (event.code === 'Tab') {
      event.preventDefault();
      // 缩进
      if (event.shiftKey) {
        bus.emit(editorId, 'replace', 'shiftTab');
      } else {
        bus.emit(editorId, 'replace', 'tab');
      }
    }
  };

  useEffect(() => {
    if (!props.previewOnly) {
      window.addEventListener('keydown', keyDownHandler);
    }

    // 编辑器卸载时移除相应的监听事件
    return () => {
      if (!props.previewOnly) {
        window.removeEventListener('keydown', keyDownHandler);
      }
    };
  }, []);

  useEffect(() => {
    // 每次更新都重新注册save监听
    if (props.previewOnly) {
      return;
    }

    const callback = () => {
      if (props.onSave) {
        props.onSave(props.modelValue);
      }
    };

    bus.remove(editorId, 'onSave', callback);
    // 注册保存事件
    bus.on(editorId, {
      name: 'onSave',
      callback
    });
  }, [props.modelValue]);
};

/**
 * 插入扩展库
 *
 * @param props
 * @param extension
 */
export const useExpansion = (props: EditorProp) => {
  const { noPrettier, previewOnly, noIconfont } = props;

  const { editorExtensions } = configOption;

  // 判断是否需要插入prettier标签
  const noPrettierScript =
    noPrettier || !!configOption.editorExtensions?.prettier?.prettierInstance;

  // 判断是否需要插入prettier markdown扩展标签
  const noParserMarkdownScript =
    noPrettier || !!configOption.editorExtensions?.prettier?.parserMarkdownInstance;

  // 判断是否需要插入裁剪图片标签
  const noCropperScript = !!configOption.editorExtensions?.cropper?.instance;

  useEffect(() => {
    // 图标
    const iconfontScript = document.createElement('script');
    iconfontScript.src = editorExtensions?.iconfont || iconfontUrl;
    iconfontScript.id = `${prefix}-icon`;

    // prettier
    const prettierScript = document.createElement('script');
    const prettierMDScript = document.createElement('script');

    prettierScript.src = editorExtensions?.prettier?.standaloneJs || prettierUrl.main;
    prettierScript.id = `${prefix}-prettier`;

    prettierMDScript.src =
      editorExtensions?.prettier?.parserMarkdownJs || prettierUrl.markdown;
    prettierMDScript.id = `${prefix}-prettierMD`;

    // 裁剪图片
    const cropperLink = document.createElement('link');
    cropperLink.rel = 'stylesheet';
    cropperLink.href = editorExtensions?.cropper?.css || cropperUrl.css;
    cropperLink.id = `${prefix}-cropperCss`;

    const cropperScript = document.createElement('script');
    cropperScript.src = editorExtensions?.cropper?.js || cropperUrl.js;
    cropperScript.id = `${prefix}-cropper`;

    // 非仅预览模式才添加扩展
    if (!previewOnly) {
      if (!noIconfont) {
        appendHandler(iconfontScript);
      }

      if (!noCropperScript) {
        appendHandler(cropperLink);
        appendHandler(cropperScript);
      }

      if (!noPrettierScript) {
        appendHandler(prettierScript);
      }

      if (!noParserMarkdownScript) {
        appendHandler(prettierMDScript);
      }
    }
  }, []);
};

/**
 *  错误监听
 *
 * @param editorId
 * @param onError
 */
export const useErrorCatcher = (editorId: string, onError: (err: InnerError) => void) => {
  useEffect(() => {
    bus.on(editorId, {
      name: 'errorCatcher',
      callback: (err: InnerError) => {
        if (onError instanceof Function) {
          onError(err);
        }
      }
    });
  }, []);
};

/**
 * 上传图片事件
 * @param props
 */
export const useUploadImg = (props: EditorProp) => {
  const { editorId = defaultEditorId, previewOnly = false } = props;

  const uploadImageCallBack = (files: Array<File>, cb: () => void) => {
    const insertHanlder = (urls: Array<string>) => {
      bus.emit(editorId, 'replace', 'image', {
        desc: '',
        urls
      });

      cb && cb();
    };

    if (props.onUploadImg) {
      props.onUploadImg(files, insertHanlder);
    }
  };

  useEffect(() => {
    if (!previewOnly) {
      bus.remove(editorId, 'uploadImage', uploadImageCallBack);
      // 监听上传图片
      bus.on(editorId, {
        name: 'uploadImage',
        callback: uploadImageCallBack
      });
    }

    return () => {
      // 清空所有的事件监听
      bus.clear(editorId);
    };
  }, []);
};

/**
 * 内部目录状态
 *
 * @param props
 * @returns
 */
export const useCatalog = (props: EditorProp) => {
  const {
    editorId = defaultEditorId,
    toolbars = allToolbar,
    toolbarsExclude = []
  } = props;

  const [catalogVisible, setCatalogVisible] = useState(false);

  useEffect(() => {
    bus.on(editorId, {
      name: 'catalogShow',
      callback: () => {
        setCatalogVisible((_catalogVisible) => !_catalogVisible);
      }
    });
  }, []);

  // 是否挂载目录组件
  const catalogShow = useMemo(() => {
    return !toolbarsExclude.includes('catalog') && toolbars.includes('catalog');
  }, [toolbars, toolbarsExclude]);

  const catalogStyle = useMemo<CSSProperties>(() => {
    return {
      display: catalogVisible ? 'block' : 'none'
    };
  }, [catalogVisible]);

  return { catalogShow, catalogStyle };
};

// 初始为空，渲染到页面后获取页面属性
let bodyOverflowHistory = '';

/**
 * highlight及language重构
 * [SettingType, (k: keyof typeof setting) => void] => {}
 * @param props
 * @param extension
 * @returns
 */
export const useConfig = (props: EditorProp) => {
  const { theme = 'light', codeTheme = 'atom', language = 'zh-CN' } = props;

  const highlight = useMemo(() => {
    const highlightConfig = configOption?.editorExtensions?.highlight;

    const cssList = {
      ...codeCss,
      ...highlightConfig?.css
    };

    return {
      js: highlightConfig?.js || highlightUrl,
      css: cssList[codeTheme] ? cssList[codeTheme][theme] : codeCss.atom[theme]
    };
  }, [theme, codeTheme]);

  // 缓存语言设置
  const usedLanguageText = useMemo(() => {
    const allText: any = {
      ...staticTextDefault,
      ...configOption?.editorConfig?.languageUserDefined
    };

    if (allText[language]) {
      return allText[language];
    } else {
      return staticTextDefault['zh-CN'];
    }
  }, [language]);

  const { preview = true, htmlPreview = false, pageFullScreen = false } = props;

  const [setting, setSetting] = useState<SettingType>({
    pageFullScreen: pageFullScreen,
    fullscreen: false,
    preview: preview,
    htmlPreview: preview ? false : htmlPreview
  });

  const updateSetting = useCallback((k: keyof typeof setting) => {
    setSetting((settingN) => {
      const nextSetting = {
        ...settingN,
        [k]: !settingN[k]
      } as SettingType;

      if (k === 'preview' && nextSetting.preview) {
        nextSetting.htmlPreview = false;
      } else if (k === 'htmlPreview' && nextSetting.htmlPreview) {
        nextSetting.preview = false;
      }

      return nextSetting;
    });
  }, []);

  useEffect(() => {
    // 保存body部分样式
    bodyOverflowHistory = document.body.style.overflow;
  }, []);

  useEffect(() => {
    if (setting.pageFullScreen || setting.fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = bodyOverflowHistory;
    }
  }, [setting.pageFullScreen, setting.fullscreen]);

  return [highlight, usedLanguageText, setting, updateSetting];
};
