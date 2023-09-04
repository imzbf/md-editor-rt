import {
  ForwardedRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
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
  MdPreviewStaticProps,
  FocusOption
} from './type';
import {
  prefix,
  iconfontUrl,
  prettierUrl,
  cropperUrl,
  allToolbar,
  codeCss,
  highlightUrl,
  staticTextDefault,
  configOption,
  defaultProps,
  iconfontClassUrl
} from './config';
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
  TEXTAREA_FOCUS,
  BUILD_FINISHED,
  ERROR_CATCHER,
  REPLACE,
  UPLOAD_IMAGE
} from './static/event-name';

/**
 * 键盘监听
 *
 * @param props
 * @param staticProps
 */
export const useOnSave = (props: EditorProps, staticProps: StaticProps) => {
  const { modelValue } = props;
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const callback = () => {
      if (props.onSave) {
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

        props.onSave(props.modelValue, htmlPromise);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelValue, props, state.buildFinished, state.html]);

  useEffect(() => {
    // 编辑后添加未编译完成标识
    setState((_state) => {
      return {
        ..._state,
        buildFinished: false
      };
    });
  }, [modelValue]);
};

/**
 * 插入编辑器支持的扩展外链
 *
 * @param staticProps
 */
export const useExpansion = (staticProps: StaticProps) => {
  const { noPrettier, noUploadImg } = staticProps;

  const { editorExtensions } = configOption;

  // 判断是否需要插入prettier标签
  const noPrettierScript =
    noPrettier || !!configOption.editorExtensions?.prettier?.prettierInstance;

  // 判断是否需要插入prettier markdown扩展标签
  const noParserMarkdownScript =
    noPrettier || !!configOption.editorExtensions?.prettier?.parserMarkdownInstance;

  // 判断是否需要插入裁剪图片标签
  const noCropperScript =
    noUploadImg || !!configOption.editorExtensions?.cropper?.instance;

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useExpansionPreview(staticProps);
};

export const useExpansionPreview = ({ noIconfont }: MdPreviewStaticProps) => {
  useEffect(() => {
    if (!noIconfont) {
      if (configOption.iconfontType === 'svg') {
        // 图标
        const iconfontScript = document.createElement('script');
        iconfontScript.src = configOption.editorExtensions?.iconfont || iconfontUrl;
        iconfontScript.id = `${prefix}-icon`;
        appendHandler(iconfontScript);
      } else {
        const iconfontLink = document.createElement('link');
        iconfontLink.rel = 'stylesheet';
        iconfontLink.href =
          configOption.editorExtensions?.iconfontClass || iconfontClassUrl;
        iconfontLink.id = `${prefix}-icon-class`;

        appendHandler(iconfontLink);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      name: ERROR_CATCHER,
      callback: onError
    });

    return () => {
      bus.remove(editorId, ERROR_CATCHER, onError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onError]);
};

/**
 * 上传图片事件
 * @param props
 * @param staticProps
 */
export const useUploadImg = (props: EditorProps, staticProps: StaticProps) => {
  const { editorId } = staticProps;

  useEffect(() => {
    const uploadImageCallBack = (files: Array<File>, cb: () => void) => {
      const insertHanlder = (urls: Array<string>) => {
        bus.emit(editorId, REPLACE, 'image', {
          desc: '',
          urls
        });

        cb && cb();
      };

      if (props.onUploadImg) {
        props.onUploadImg(files, insertHanlder);
      }
    };

    // 监听上传图片
    bus.on(editorId, {
      name: UPLOAD_IMAGE,
      callback: uploadImageCallBack
    });

    return () => {
      bus.remove(editorId, UPLOAD_IMAGE, uploadImageCallBack);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.onUploadImg]);
};

/**
 * 内部目录状态
 *
 * @param props
 * @param staticProps
 * @returns
 */
export const useCatalog = (props: EditorProps, staticProps: StaticProps) => {
  const { toolbars = allToolbar, toolbarsExclude = [] } = props;
  const { editorId } = staticProps;

  const [catalogShow, setCatalogShow] = useState(false);

  useEffect(() => {
    bus.on(editorId, {
      name: CHANGE_CATALOG_VISIBLE,
      callback: (v: boolean | undefined) => {
        if (v === undefined) {
          setCatalogShow((_catalogShow) => !_catalogShow);
        } else {
          setCatalogShow(v);
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 是否挂载目录组件
  const catalogVisible = useMemo(() => {
    return (
      !toolbarsExclude.includes('catalog') && toolbars.includes('catalog') && catalogShow
    );
  }, [catalogShow, toolbars, toolbarsExclude]);

  return catalogVisible;
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
    const highlightConfig = configOption?.editorExtensions?.highlight;

    const cssList = {
      ...codeCss,
      ...highlightConfig?.css
    };

    const _theme =
      codeStyleReverse && codeStyleReverseList.includes(previewTheme)
        ? 'dark'
        : (theme as Themes);

    return {
      js: highlightConfig?.js || highlightUrl,
      css: cssList[codeTheme] ? cssList[codeTheme][_theme] : codeCss.atom[_theme]
    };
  }, [codeStyleReverse, codeStyleReverseList, previewTheme, theme, codeTheme]);

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

  const [setting, setSetting] = useState<SettingType>({
    pageFullscreen,
    fullscreen: false,
    preview: preview,
    htmlPreview: preview ? false : htmlPreview
  });

  const updateSetting = useCallback((k: keyof typeof setting, v: boolean) => {
    setSetting((_setting) => {
      const nextSetting = {
        ..._setting,
        [k]: v === undefined ? !_setting[k] : v
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
  updateSetting: UpdateSetting
) => {
  const { editorId } = staticProps;

  useEffect(() => {
    bus.emit(editorId, PAGE_FULL_SCREEN_CHANGED, setting.pageFullscreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting.pageFullscreen]);

  useEffect(() => {
    bus.emit(editorId, FULL_SCREEN_CHANGED, setting.fullscreen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting.fullscreen]);

  useEffect(() => {
    bus.emit(editorId, PREVIEW_CHANGED, setting.preview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting.preview]);

  useEffect(() => {
    bus.emit(editorId, HTML_PREVIEW_CHANGED, setting.htmlPreview);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setting.htmlPreview]);

  useEffect(() => {
    bus.emit(editorId, CATALOG_VISIBLE_CHANGED, catalogVisible);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogVisible]);

  useImperativeHandle(
    editorRef,
    () => {
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
          bus.emit(editorId, TEXTAREA_FOCUS, options);
        }
      };

      return exposeParam;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [updateSetting]
  );
};
