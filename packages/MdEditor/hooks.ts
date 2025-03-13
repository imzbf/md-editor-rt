import {
  ForwardedRef,
  MutableRefObject,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react';
import bus from './utils/event-bus';
import {
  EditorProps,
  InnerError,
  SettingType,
  StaticProps,
  Themes,
  ExposeParam,
  UpdateSetting,
  ExposeEvent,
  FocusOption,
  UploadImgCallBack,
  MdPreviewProps
} from './type';
import { prefix, codeCss, staticTextDefault, configOption, defaultProps } from './config';
import { appendHandler } from './utils/dom';
import {
  CHANGE_CATALOG_VISIBLE,
  CHANGE_FULL_SCREEN,
  ON_SAVE,
  PAGE_FULL_SCREEN_CHANGED,
  FULL_SCREEN_CHANGED,
  PREVIEW_CHANGED,
  HTML_PREVIEW_CHANGED,
  CATALOG_VISIBLE_CHANGED,
  BUILD_FINISHED,
  ERROR_CATCHER,
  REPLACE,
  UPLOAD_IMAGE,
  RERENDER,
  EVENT_LISTENER,
  PREVIEW_ONLY_CHANGED
} from './static/event-name';
import { ContentExposeParam } from './layouts/Content/type';
import { CDN_IDS } from './static';

/**
 * 键盘监听
 *
 * @param props
 * @param staticProps
 */
export const useOnSave = (props: EditorProps, staticProps: StaticProps) => {
  const { value, modelValue, onSave } = props;
  const { editorId } = staticProps;

  const [state, setState] = useState({
    // 是否已编译成html
    buildFinished: false,
    // 存储当前最新的html
    html: ''
  });

  useEffect(() => {
    const buildFinishedCb = (html: string) => {
      setState(() => {
        return {
          buildFinished: true,
          html
        };
      });
    };

    bus.on(editorId, {
      name: BUILD_FINISHED,
      callback: buildFinishedCb
    });

    // 编辑器卸载时移除相应的监听事件
    return () => {
      bus.remove(editorId, BUILD_FINISHED, buildFinishedCb);
    };
  }, [editorId]);

  useEffect(() => {
    const callback = () => {
      if (onSave) {
        const htmlPromise = new Promise<string>((rev) => {
          if (state.buildFinished) {
            rev(state.html);
          } else {
            // 构建完成出发方法
            const buildFinishedCallback = (html: string) => {
              rev(html);

              bus.remove(editorId, BUILD_FINISHED, buildFinishedCallback);
            };

            bus.on(editorId, {
              name: BUILD_FINISHED,
              callback: buildFinishedCallback
            });
          }
        });

        onSave(value || modelValue || '', htmlPromise);
      }
    };

    // 注册保存事件
    bus.on(editorId, {
      name: ON_SAVE,
      callback
    });

    return () => {
      bus.remove(editorId, ON_SAVE, callback);
    };
  }, [editorId, modelValue, onSave, state.buildFinished, state.html, value]);

  useEffect(() => {
    // 编辑后添加未编译完成标识
    setState((_state) => {
      return {
        ..._state,
        buildFinished: false
      };
    });
  }, [value, modelValue]);
};

/**
 * 插入编辑器支持的扩展外链
 *
 * @param staticProps
 */
export const useExpansion = (staticProps: StaticProps) => {
  const { noPrettier, noUploadImg } = staticProps;

  useEffect(() => {
    const { editorExtensions, editorExtensionsAttrs } = configOption;

    // 判断是否需要插入prettier标签
    const noPrettierScript = noPrettier || !!editorExtensions.prettier!.prettierInstance;

    // 判断是否需要插入prettier markdown扩展标签
    const noParserMarkdownScript =
      noPrettier || !!editorExtensions.prettier!.parserMarkdownInstance;

    // 判断是否需要插入裁剪图片标签
    const noCropperScript = noUploadImg || !!editorExtensions.cropper!.instance;

    if (!noCropperScript) {
      // 裁剪图片
      const { js = {}, css = {} } = editorExtensionsAttrs.cropper || {};

      appendHandler('link', {
        ...css,
        rel: 'stylesheet',
        href: editorExtensions.cropper!.css,
        id: CDN_IDS.croppercss
      });
      appendHandler('script', {
        ...js,
        src: editorExtensions.cropper!.js,
        id: CDN_IDS.cropperjs
      });
    }

    // prettier
    if (!noPrettierScript) {
      const { standaloneJs = {} } = editorExtensionsAttrs.prettier || {};

      appendHandler('script', {
        ...standaloneJs,
        src: editorExtensions.prettier!.standaloneJs,
        id: CDN_IDS.prettier
      });
    }

    if (!noParserMarkdownScript) {
      const { parserMarkdownJs = {} } = editorExtensionsAttrs.prettier || {};

      appendHandler('script', {
        ...parserMarkdownJs,
        src: editorExtensions.prettier!.parserMarkdownJs,
        id: CDN_IDS.prettierMD
      });
    }
  }, [noPrettier, noUploadImg]);
};

export const useExpansionPreview = () => {};

/**
 *  错误监听
 *
 * @param editorId
 * @param onError
 */
export const useErrorCatcher = (editorId: string, onError: (err: InnerError) => void) => {
  useEffect(() => {
    bus.on(editorId, {
      name: ERROR_CATCHER,
      callback: onError
    });

    return () => {
      bus.remove(editorId, ERROR_CATCHER, onError);
    };
  }, [editorId, onError]);
};

/**
 * 上传图片事件
 * @param props
 * @param staticProps
 */
export const useUploadImg = (props: EditorProps, staticProps: StaticProps) => {
  const { editorId } = staticProps;
  const { onUploadImg } = props;

  useEffect(() => {
    const uploadImageCallBack = (files: Array<File>, cb: () => void) => {
      const insertHanlder: UploadImgCallBack = (urls) => {
        bus.emit(editorId, REPLACE, 'image', {
          desc: '',
          urls
        });

        cb?.();
      };

      onUploadImg?.(files, insertHanlder);
    };

    // 监听上传图片
    bus.on(editorId, {
      name: UPLOAD_IMAGE,
      callback: uploadImageCallBack
    });

    return () => {
      bus.remove(editorId, UPLOAD_IMAGE, uploadImageCallBack);
    };
  }, [editorId, onUploadImg]);
};

/**
 * 内部目录状态
 *
 * @param props
 * @param staticProps
 * @returns
 */
export const useCatalog = (_props: EditorProps, staticProps: StaticProps) => {
  const { editorId } = staticProps;

  const [catalogShow, setCatalogShow] = useState(false);

  useEffect(() => {
    const callback = (v: boolean | undefined) => {
      if (v === undefined) {
        setCatalogShow((_catalogShow) => !_catalogShow);
      } else {
        setCatalogShow(v);
      }
    };
    bus.on(editorId, {
      name: CHANGE_CATALOG_VISIBLE,
      callback
    });

    return () => {
      bus.remove(editorId, CHANGE_CATALOG_VISIBLE, callback);
    };
  }, [editorId]);

  return catalogShow;
};

// 初始为空，渲染到页面后获取页面属性
let bodyOverflowHistory = '';

/**
 * 收集整理公共配置
 * highlight及language重构
 * [SettingType, (k: keyof typeof setting) => void] => {}
 * @param props
 * @returns
 */
export const useConfig = (props: EditorProps) => {
  const {
    theme = defaultProps.theme,
    preview = defaultProps.preview,
    htmlPreview = defaultProps.htmlPreview,
    pageFullscreen = defaultProps.pageFullscreen,
    previewTheme = defaultProps.previewTheme,
    codeTheme = defaultProps.codeTheme,
    language = defaultProps.language,
    codeStyleReverse = defaultProps.codeStyleReverse,
    codeStyleReverseList = defaultProps.codeStyleReverseList
  } = props;

  const highlight = useMemo(() => {
    const hljsUrls = configOption.editorExtensions.highlight;
    const hljsAttrs = configOption.editorExtensionsAttrs.highlight;

    // 链接
    const { js: jsUrl } = hljsUrls!;
    const cssList = {
      ...codeCss,
      ...hljsUrls!.css
    };

    // 属性
    const { js: jsAttrs, css: cssAttrs = {} } = hljsAttrs || {};

    const _theme =
      codeStyleReverse && codeStyleReverseList.includes(previewTheme)
        ? 'dark'
        : (theme as Themes);

    // 找到对应代码主题的链接和属性
    const codeCssHref = cssList[codeTheme]
      ? cssList[codeTheme][_theme]
      : codeCss.atom[_theme];
    const codeCssAttrs =
      cssList[codeTheme] && cssAttrs[codeTheme]
        ? cssAttrs[codeTheme][_theme]
        : cssAttrs['atom']
          ? cssAttrs['atom'][_theme]
          : {};

    return {
      js: {
        src: jsUrl,
        ...jsAttrs
      },
      css: {
        href: codeCssHref,
        ...codeCssAttrs
      }
    };
  }, [codeStyleReverse, codeStyleReverseList, previewTheme, theme, codeTheme]);

  // 缓存语言设置
  const usedLanguageText = useMemo(() => {
    const allText: any = {
      ...staticTextDefault,
      ...configOption.editorConfig.languageUserDefined
    };

    if (allText[language]) {
      return allText[language];
    } else {
      return staticTextDefault['zh-CN'];
    }
  }, [language]);

  const [setting, setSetting] = useState<SettingType>({
    pageFullscreen,
    fullscreen: false,
    preview: preview,
    htmlPreview: preview ? false : htmlPreview,
    previewOnly: false
  });

  const cacheSetting = useRef(setting);

  const updateSetting = useCallback((k: keyof SettingType, v: boolean) => {
    setSetting((_setting) => {
      const realValue = v === undefined ? !_setting[k] : v;

      const nextSetting: SettingType = {
        ..._setting
      };

      switch (k) {
        case 'preview': {
          nextSetting.htmlPreview = false;
          nextSetting.previewOnly = false;

          break;
        }

        case 'htmlPreview': {
          nextSetting.preview = false;
          nextSetting.previewOnly = false;

          break;
        }

        case 'previewOnly': {
          if (realValue) {
            if (!nextSetting.preview && !nextSetting.htmlPreview) {
              // 如果没有显示预览模块，则需要手动展示
              nextSetting.preview = true;
            }
          } else {
            if (!cacheSetting.current.preview) {
              nextSetting.preview = false;
            }

            if (!cacheSetting.current.htmlPreview) {
              nextSetting.htmlPreview = false;
            }
          }

          break;
        }
      }

      cacheSetting.current[k] = realValue;
      nextSetting[k] = realValue;

      return nextSetting;
    });
  }, []);

  useEffect(() => {
    // 保存body部分样式
    bodyOverflowHistory = document.body.style.overflow;
  }, []);

  useEffect(() => {
    if (setting.pageFullscreen || setting.fullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = bodyOverflowHistory;
    }
  }, [setting.pageFullscreen, setting.fullscreen]);

  return [highlight, usedLanguageText, setting, updateSetting];
};

/**
 * 向外暴露属性
 *
 * @param editorRef 绑定的ref
 * @param staticProps 静态属性
 * @param catalogVisible 目录显示状态
 * @param setting 内部状态集合
 * @param updateSetting 更新内部集合
 */
export const useExpose = (
  editorRef: ForwardedRef<unknown>,
  staticProps: StaticProps,
  catalogVisible: boolean,
  setting: SettingType,
  updateSetting: UpdateSetting,
  codeRef: MutableRefObject<ContentExposeParam | undefined>
) => {
  const { editorId } = staticProps;

  useEffect(() => {
    bus.emit(editorId, PAGE_FULL_SCREEN_CHANGED, setting.pageFullscreen);
  }, [editorId, setting.pageFullscreen]);

  useEffect(() => {
    bus.emit(editorId, FULL_SCREEN_CHANGED, setting.fullscreen);
  }, [editorId, setting.fullscreen]);

  useEffect(() => {
    bus.emit(editorId, PREVIEW_CHANGED, setting.preview);
  }, [editorId, setting.preview]);

  useEffect(() => {
    bus.emit(editorId, PREVIEW_ONLY_CHANGED, setting.previewOnly);
  }, [editorId, setting.previewOnly]);

  useEffect(() => {
    bus.emit(editorId, HTML_PREVIEW_CHANGED, setting.htmlPreview);
  }, [editorId, setting.htmlPreview]);

  useEffect(() => {
    bus.emit(editorId, CATALOG_VISIBLE_CHANGED, catalogVisible);
  }, [catalogVisible, editorId]);

  useImperativeHandle(editorRef, () => {
    const exposeParam: ExposeParam = {
      on(eventName, callBack) {
        switch (eventName) {
          case 'pageFullscreen': {
            bus.on(editorId, {
              name: PAGE_FULL_SCREEN_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['pageFullscreen'])(status);
              }
            });

            break;
          }
          case 'fullscreen': {
            bus.on(editorId, {
              name: FULL_SCREEN_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['fullscreen'])(status);
              }
            });

            break;
          }

          case 'preview': {
            bus.on(editorId, {
              name: PREVIEW_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['preview'])(status);
              }
            });

            break;
          }

          case 'previewOnly': {
            bus.on(editorId, {
              name: PREVIEW_ONLY_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['previewOnly'])(status);
              }
            });

            break;
          }

          case 'htmlPreview': {
            bus.on(editorId, {
              name: HTML_PREVIEW_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['htmlPreview'])(status);
              }
            });

            break;
          }

          case 'catalog': {
            bus.on(editorId, {
              name: CATALOG_VISIBLE_CHANGED,
              callback(status: boolean) {
                (callBack as ExposeEvent['catalog'])(status);
              }
            });

            break;
          }

          default: {
            //
          }
        }
      },
      togglePageFullscreen(status) {
        updateSetting('pageFullscreen', status);
      },
      toggleFullscreen(status) {
        bus.emit(editorId, CHANGE_FULL_SCREEN, status);
      },
      togglePreview(status) {
        updateSetting('preview', status);
      },
      togglePreviewOnly(status) {
        updateSetting('previewOnly', status);
      },
      toggleHtmlPreview(status) {
        updateSetting('htmlPreview', status);
      },
      toggleCatalog(status) {
        bus.emit(editorId, CHANGE_CATALOG_VISIBLE, status);
      },
      triggerSave() {
        bus.emit(editorId, ON_SAVE);
      },
      insert(generate) {
        bus.emit(editorId, REPLACE, 'universal', { generate });
      },
      focus(options: FocusOption) {
        codeRef.current?.focus(options);
      },
      rerender() {
        bus.emit(editorId, RERENDER);
      },
      getSelectedText() {
        return codeRef.current?.getSelectedText();
      },
      resetHistory() {
        codeRef.current?.resetHistory();
      },
      domEventHandlers(handlers) {
        bus.emit(editorId, EVENT_LISTENER, handlers);
      },
      execCommand(direct) {
        bus.emit(editorId, REPLACE, direct);
      },
      getEditorView() {
        return codeRef.current?.getEditorView();
      }
    };

    return exposeParam;
  }, [codeRef, editorId, updateSetting]);
};

export const useEditorId = (props: MdPreviewProps) => {
  const defaultId = useId();
  return props.id || props.editorId || prefix + '-' + defaultId.replaceAll(':', '');
};
