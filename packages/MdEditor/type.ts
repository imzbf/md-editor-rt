import { CSSProperties, ReactElement } from 'react';
import markdownit from 'markdown-it';
import { CompletionSource } from '@codemirror/autocomplete';
import { Extension } from '@codemirror/state';
import { KeyBinding, EditorView } from '@codemirror/view';
import { IconName } from './components/Icon/Icon';
import { ToolDirective } from './utils/content-help';

declare global {
  interface Window {
    hljs: any;
    prettier: any;
    prettierPlugins: any;
    Cropper: any;
    screenfull: any;
    mermaid: any;
    katex: any;
  }
}

export interface ToolbarTips {
  bold?: string;
  underline?: string;
  italic?: string;
  strikeThrough?: string;
  title?: string;
  sub?: string;
  sup?: string;
  quote?: string;
  unorderedList?: string;
  orderedList?: string;
  task?: string;
  codeRow?: string;
  code?: string;
  link?: string;
  image?: string;
  table?: string;
  mermaid?: string;
  katex?: string;
  revoke?: string;
  next?: string;
  save?: string;
  prettier?: string;
  pageFullscreen?: string;
  fullscreen?: string;
  catalog?: string;
  preview?: string;
  previewOnly?: string;
  htmlPreview?: string;
  github?: string;
  '-'?: string;
  '='?: string;
}

export interface StaticTextDefaultValue {
  toolbarTips?: ToolbarTips;
  titleItem?: {
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
  };
  imgTitleItem?: {
    link: string;
    upload: string;
    clip2upload: string;
  };
  linkModalTips?: {
    linkTitle?: string;
    imageTitle?: string;
    descLabel?: string;
    descLabelPlaceHolder?: string;
    urlLabel?: string;
    urlLabelPlaceHolder?: string;
    buttonOK?: string;
  };
  clipModalTips?: {
    title?: string;
    buttonUpload?: string;
  };
  copyCode?: {
    text?: string;
    successTips?: string;
    failTips?: string;
  };
  mermaid?: {
    // 流程图
    flow?: string;
    // 时序图
    sequence?: string;
    // 甘特图
    gantt?: string;
    // 类图
    class?: string;
    // 状态图
    state?: string;
    // 饼图
    pie?: string;
    // 关系图
    relationship?: string;
    // 旅程图
    journey?: string;
  };
  katex?: {
    inline: string;
    block: string;
  };
  footer?: {
    markdownTotal: string;
    scrollAuto: string;
  };
}

export interface StaticTextDefault {
  'zh-CN': StaticTextDefaultValue;
  'en-US': StaticTextDefaultValue;
}

export type StaticTextDefaultKey = keyof StaticTextDefault;

export type ToolbarNames = keyof ToolbarTips | number;

export type Footers = '=' | 'markdownTotal' | 'scrollSwitch' | number;

export interface SettingType {
  pageFullscreen: boolean;
  fullscreen: boolean;
  preview: boolean;
  htmlPreview: boolean;
  previewOnly: boolean;
}

export interface HeadList {
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
  active?: boolean;
}

export type Themes = 'light' | 'dark';

/**
 * 预览主题
 *
 * @list ['default', 'github', 'vuepress', 'mk-cute', 'smart-blue', 'cyanosis']
 */
export type PreviewThemes = string;

/**
 * 自定义标题ID
 */
export type MdHeadingId = (text: string, level: number, index: number) => string;

export interface MdPreviewProps {
  modelValue: string;
  /**
   * 主题
   *
   * @default 'light'
   */
  theme?: Themes;
  /**
   * 外层类名
   *
   * @default ''
   */
  className?: string;
  /**
   * 预设语言名称
   *
   * @default 'zh-CN'
   */
  language?: StaticTextDefaultKey | string;
  /**
   * html变化事件
   */
  onHtmlChanged?: HtmlChangedEvent;
  /**
   * 获取目录结构
   */
  onGetCatalog?: GetCatalogEvent;

  /**
   * 编辑器唯一标识
   *
   * @default 'md-editor-rt'
   */
  editorId?: string;
  /**
   * 预览中代码是否显示行号
   *
   * @default false
   */
  showCodeRowNumber?: boolean;
  /**
   * 预览内容样式
   *
   * @default 'default'
   */
  previewTheme?: PreviewThemes;
  /**
   * 标题的id生成方式
   *
   * @default (text: string) => text
   */
  mdHeadingId?: MdHeadingId;
  /**
   * 编辑器样式
   */
  style?: CSSProperties;
  /**
   * 不使用该mermaid
   *
   * @default false
   */
  noMermaid?: boolean;
  /**
   *
   * 不能保证文本正确的情况，在marked编译md文本后通过该方法处理
   * 推荐DOMPurify、sanitize-html
   *
   * @default (text: string) => text
   */
  sanitize?: (html: string) => string;
  /**
   * 不使用katex
   *
   * @default false
   */
  noKatex?: boolean;
  /**
   * 代码主题
   *
   * @default 'atom'
   */
  codeTheme?: string;
  /**
   * 不插入iconfont链接
   *
   * @default false
   */
  noIconfont?: boolean;
  /**
   * 复制代码格式化方法
   *
   * @default (text) => text
   */
  formatCopiedText?: (text: string) => string;
  /**
   * 是否禁用上传图片
   *
   * @default false
   */
  /**
   * 某些预览主题的代码模块背景是暗色系
   * 将这个属性设置为true，会自动在该主题下的light模式下使用暗色系的代码风格
   *
   * @default true
   */
  codeStyleReverse?: boolean;
  /**
   * 需要自动调整的预览主题
   *
   * @default ['default', 'mk-cute']
   */
  codeStyleReverseList?: Array<string>;
  /**
   * 是否启用代码高亮
   */
  noHighlight?: boolean;
  /**
   * 是否关闭编辑器默认的放大功能
   */
  noImgZoomIn?: boolean;
  /**
   * 自定义的图标
   */
  customIcon?: CustomIcon;
  /**
   * 转换生成的mermaid代码
   *
   * @param html
   * @returns
   */
  sanitizeMermaid?: (html: string) => Promise<string>;
  /**
   * 是否开启折叠代码功能
   * 不开启会使用div标签替代details标签
   *
   * @default true
   */
  codeFoldable?: boolean;
  /**
   * 触发自动折叠代码的行数阈值
   *
   * @default 30
   */
  autoFoldThreshold?: number;
}

export type TableShapeType = [number, number] | [number, number, number, number];

export interface EditorProps extends MdPreviewProps {
  /**
   * input回调事件
   */
  onChange?: ChangeEvent;
  /**
   * 保存事件
   */
  onSave?: SaveEvent;
  /**
   * 上传图片事件
   */
  onUploadImg?: UploadImgEvent;
  /**
   * 是否页面内全屏
   *
   * @default false
   */
  pageFullscreen?: boolean;
  /**
   * 是否展开预览
   *
   * @default true
   */
  preview?: boolean;
  /**
   * 是否展开html预览
   *
   * @default false
   */
  htmlPreview?: boolean;
  /**
   * 工具栏选择显示
   *
   * @default allToolbar
   */
  toolbars?: Array<ToolbarNames>;
  /**
   * 工具栏选择不显示
   *
   * @default []
   */
  toolbarsExclude?: Array<ToolbarNames>;
  /**
   * 格式化md
   *
   * @default true
   */
  noPrettier?: boolean;

  /**
   * 一个tab等于空格数
   *
   * @default 2
   */
  tabWidth?: number;

  /**
   * 表格预设格子数
   *
   * @default [6, 4]
   */
  tableShape?: TableShapeType;

  /**
   * 空提示
   *
   * @default ''
   */
  placeholder?: string;

  /**
   * 自定义的工具栏列表
   */
  defToolbars?: Array<ReactElement>;
  /**
   * 内部错误捕获
   */
  onError?: ErrorEvent;

  /**
   * 页脚列表显示顺序
   */
  footers?: Array<Footers>;
  /**
   * 是否默认激活输入框和预览框同步滚动
   *
   * @default true
   */
  scrollAuto?: boolean;
  /**
   * 自定义的也叫工具组件列表
   */
  defFooters?: Array<string | ReactElement>;

  noUploadImg?: boolean;

  /**
   * 文本区域自动获得焦点
   *
   * @default false
   */
  autoFocus?: boolean;
  /**
   * 禁用文本区域
   *
   * @default false
   */
  disabled?: boolean;
  /**
   * 文本区域为只读
   *
   * @default false
   */
  readOnly?: boolean;
  /**
   * 文本区域允许的最大字符数
   */
  maxLength?: number;
  /**
   * 是否启用自动识别粘贴代码类别
   * 目前支持 vscode 复制的代码识别
   *
   * @default false
   */
  autoDetectCode?: boolean;
  /**
   * 输入框失去焦点时触发事件
   */
  onBlur?: (event: FocusEvent) => void;
  /**
   * 输入框获得焦点时触发事件
   */
  onFocus?: (event: FocusEvent) => void;
  /**
   * @codemirror/autocomplete匹配关键词的方法列表
   *
   * 它会被像下面这样嵌入编辑器
   *
   * import { autocompletion } from '@codemirror/autocomplete';
   * autocompletion({
   *   override: [...completions]
   * })
   */
  completions?: Array<CompletionSource>;
  /**
   * 是否在工具栏下面显示对应的文字名称
   *
   * @default false
   */
  showToolbarName?: boolean;
  /**
   * 字符输入事件
   */
  onInput?: (e: Event) => void;
  /**
   * 拖放事件
   *
   * @param event
   */
  onDrop?: (event: DragEvent) => void;
  /**
   * 输入框的默认宽度
   *
   * @example '100px'/'50%'
   */
  inputBoxWitdh?: string;
  /**
   * 输入框宽度变化事件
   */
  onInputBoxWitdhChange?: (width: string) => void;
  /**
   * 替换粘贴的图片链接
   *
   * @param t 图片链接
   * @returns
   */
  transformImgUrl?: (t: string) => string | Promise<string>;
}

export interface ContentType {
  editorId: string;
  tabWidth: number;
  highlight: {
    js: Partial<HTMLElementTagNameMap['script']>;
    css: Partial<HTMLElementTagNameMap['link']>;
  };
  showCodeRowNumber: boolean;
  usedLanguageText: StaticTextDefaultValue;
  theme: Themes;
  language: string;
  previewTheme: PreviewThemes;
  customIcon: CustomIcon;
}

export interface MermaidTemplate {
  /**
   * 流程图
   */
  flow?: string;
  /**
   * 时序图
   */
  sequence?: string;
  /**
   * 甘特图
   */
  gantt?: string;
  /**
   * 类图
   */
  class?: string;
  /**
   * 状态图
   */
  state?: string;
  /**
   * 饼图
   */
  pie?: string;
  /**
   * 关系图
   */
  relationship?: string;
  /**
   * 旅程图
   */
  journey?: string;
}

export interface MarkdownItConfigPlugin {
  type: string;
  plugin: markdownit.PluginWithParams;
  options: any;
}

export interface ConfigOption {
  /**
   * 编辑器内部依赖库
   */
  editorExtensions: {
    highlight?: {
      instance?: any;
      js?: string;
      css?: CodeCss;
    };
    prettier?: {
      prettierInstance?: any;
      parserMarkdownInstance?: any;

      standaloneJs?: string;
      parserMarkdownJs?: string;
    };
    cropper?: {
      instance?: any;
      js?: string;
      css?: string;
    };
    iconfont?: string;
    /**
     * class方式的图标
     */
    iconfontClass?: string;
    screenfull?: {
      instance?: any;
      js?: string;
    };
    mermaid?: {
      instance?: any;
      js?: string;
    };
    katex?: {
      instance?: any;
      js?: string;
      css?: string;
    };
  };
  /**
   * 对应editorExtensions中的cdn链接标签属性
   *
   * 不要尝试在editorExtensionsAttrs定义script的src\onload\id，link的rel\href\id
   * 它们会被默认值覆盖
   */
  editorExtensionsAttrs: {
    highlight?: {
      js?: Partial<HTMLElementTagNameMap['script']>;
      css?: CodeCssAttrs;
    };
    prettier?: {
      standaloneJs?: Partial<HTMLElementTagNameMap['script']>;
      parserMarkdownJs?: Partial<HTMLElementTagNameMap['script']>;
    };
    cropper?: {
      js?: Partial<HTMLElementTagNameMap['script']>;
      css?: Partial<HTMLElementTagNameMap['link']>;
    };
    iconfont?: Partial<HTMLElementTagNameMap['script']>;
    /**
     * class方式的图标
     */
    iconfontClass?: Partial<HTMLElementTagNameMap['link']>;
    screenfull?: {
      js?: Partial<HTMLElementTagNameMap['script']>;
    };
    mermaid?: {
      js?: Partial<HTMLElementTagNameMap['script']>;
    };
    katex?: {
      js?: Partial<HTMLElementTagNameMap['script']>;
      css?: Partial<HTMLElementTagNameMap['link']>;
    };
  };
  editorConfig: {
    /**
     * 自定义提示语言
     */
    languageUserDefined?: { [key: string]: StaticTextDefaultValue };
    /**
     * 自定义内部mermaid模块
     */
    mermaidTemplate?: MermaidTemplate;
    /**
     * 输入渲染延迟（ms）
     */
    renderDelay?: number;
    /**
     * 内部的弹窗、下拉框等内联zIndex
     * @default 20000
     */
    zIndex?: number;
  };
  /**
   * 根据主题和内部默认的codeMirror扩展自定义新的扩展
   *
   * @params theme 当前主题
   * @params innerExtensions 当前主题下的扩展列表
   * [keymap, minimalSetup, markdown, EditorView.lineWrapping, EditorView.updateListener, EditorView.domEventHandlers, oneDark??oneLight]
   * [快捷键, 最低配置, markdown识别, 横向自动换行, 更新事件, dom监听事件, oneDark主题(暗夜模式下), oneLight(默认模式下)]
   *
   * @params keyBindings md-editor-v3内置的快捷键
   */
  codeMirrorExtensions: (
    theme: Themes,
    extensions: Array<Extension>,
    keyBindings: Array<KeyBinding>
  ) => Array<Extension>;
  /**
   * 自定义markdown-it核心库扩展、属性等
   */
  markdownItConfig: (
    md: markdownit,
    options: {
      editorId: string;
    }
  ) => void;
  /**
   * 挑选编辑器已预设的markdownIt的扩展
   *
   * @param plugins markdownIt的扩展，带编辑器已设定的属性
   * @returns plugins
   */
  markdownItPlugins: (
    plugins: Array<MarkdownItConfigPlugin>,
    options: {
      editorId: string;
    }
  ) => Array<MarkdownItConfigPlugin>;
  /**
   * 如果使用内部的图标，可以切换展示的方式
   *
   * 以规避某些问题，例如Shadow Dom对Svg use的支持问题
   */
  iconfontType: 'svg' | 'class';
  /**
   * mermaid配置项
   *
   * @param base
   * @returns
   */
  mermaidConfig: (base: any) => any;
}

/**
 * 扩展编辑器内部功能，包括marked和一些内部依赖实例，如highlight、cropper等
 */
export type Config = (options: Partial<ConfigOption>) => void;

/**
 * 编辑器操作潜在的错误
 */
export interface InnerError {
  name: 'Cropper' | 'fullscreen' | 'prettier' | 'overlength';
  message: string;
  data: any;
}

export interface CodeCss {
  [key: string]: {
    light: string;
    dark: string;
  };
}

export interface CodeCssAttrs {
  [key: string]: {
    light: Partial<HTMLElementTagNameMap['link']>;
    dark: Partial<HTMLElementTagNameMap['link']>;
  };
}

export interface MdPreviewStaticProps {
  editorId: string;
  noMermaid: boolean;
  noKatex: boolean;
  noIconfont: boolean;
  noHighlight: boolean;
}

export interface StaticProps extends MdPreviewStaticProps {
  noPrettier: boolean;
  noUploadImg: boolean;
}

export type UpdateSetting = (k: keyof SettingType, v?: boolean | undefined) => void;

export type ChangeEvent = (v: string) => void;
export type SaveEvent = (v: string, h: Promise<string>) => void;

export type UploadImgCallBackParam =
  | string[]
  | Array<{ url: string; alt: string; title: string }>;
export type UploadImgCallBack = (urls: UploadImgCallBackParam) => void;
export type UploadImgEvent = (files: Array<File>, callBack: UploadImgCallBack) => void;

export type HtmlChangedEvent = (h: string) => void;
export type GetCatalogEvent = (list: HeadList[]) => void;
export type ErrorEvent = (err: InnerError) => void;

export interface ExposeEvent {
  pageFullscreen(status: boolean): void;
  fullscreen(status: boolean): void;
  preview(status: boolean): void;
  previewOnly(status: boolean): void;
  htmlPreview(status: boolean): void;
  catalog(status: boolean): void;
}

export type DOMEventHandlers = {
  [e in keyof HTMLElementEventMap]?: (
    event: HTMLElementEventMap[e],
    view: EditorView
  ) => boolean | void;
};

export interface InsertParam {
  // 插入的内容
  targetValue: string;
  // 是否选中插入的内容
  select?: boolean;
  // 选中位置的开始偏移量
  deviationStart?: number;
  // 选中位置的结束偏移量
  deviationEnd?: number;
}

/**
 * 插入的内容的构造函数
 */
export type InsertContentGenerator = (selectedText: string) => InsertParam;

/**
 * 插入内容的通用函数类型
 */
export type Insert = (generate: InsertContentGenerator) => void;

export type FocusOption =
  | 'start'
  | 'end'
  | {
      // 选中的开始位置，默认光标位置
      rangeAnchor?: number;
      // 选中的结束位置，默认光标位置
      rangeHead?: number;
      // 光标的位置
      cursorPos: number;
    };

export interface ExposeParam {
  /**
   * 添加事件监听
   *
   * @param eventName 事件名称
   * @param callBack 事件回调函数
   */
  on<E extends keyof ExposeEvent, C extends ExposeEvent[E]>(
    eventName: E,
    callBack: C
  ): void;

  /**
   * 切换页面内全屏
   *
   * @param status 是否页面全屏
   */
  togglePageFullscreen(status?: boolean): void;

  /**
   * 切换屏幕全屏
   *
   * @param status 是否屏幕全屏
   */
  toggleFullscreen(status?: boolean): void;

  /**
   * 切换是否显示预览
   *
   * @param status 是否显示预览
   */
  togglePreview(status?: boolean): void;

  togglePreviewOnly(status?: boolean): void;

  /**
   * 切换是否显示html预览
   *
   * @param status html预览状态
   */
  toggleHtmlPreview(status?: boolean): void;

  /**
   * 切换是否显示目录
   *
   * @param status 是否显示目录，不设置默认相反
   */
  toggleCatalog(status?: boolean): void;

  /**
   * 触发保存
   */
  triggerSave(): void;

  /**
   * 手动向文本框插入内容
   *
   * @param {Function} generate 构造插入内容方法
   * 构造方法提供「当前选中」的内容为入参
   * 返回「待插入内容」和插入的属性
   * 入参 selectedText 当前选中的内容
   *
   * targetValue     待插入内容
   * select         插入后是否自动选中内容
   * deviationStart 插入后选中位置的开始偏移量
   * deviationEnd   插入后选中位置的结束偏移量
   *
   */
  insert: Insert;

  /**
   * 手动聚焦
   *
   * @param options 聚焦时光标的位置，不提供默认上次失焦时的位置
   */
  focus(options?: FocusOption): void;
  /**
   * 手动重新渲染
   */
  rerender(): void;
  /**
   * 获取当前选中的文本
   */
  getSelectedText(): string | undefined;
  /**
   * 重置已经存在的历史记录
   */
  resetHistory(): void;
  /**
   * codemirror事件
   *
   * @param handlers
   */
  domEventHandlers(handlers: DOMEventHandlers): void;
  /**
   * 执行内部插入命令
   *
   * @param direct
   */
  execCommand(direct: ToolDirective): void;
}

export type ExposePreviewParam = Pick<ExposeParam, 'rerender'>;

/**
 * 自定义图标的数据类型
 */
export type CustomIcon = {
  [key in IconName]?: {
    component: any;
    props?: {
      [key: string | number | symbol]: any;
    };
  };
} & {
  copy?: string;
};
