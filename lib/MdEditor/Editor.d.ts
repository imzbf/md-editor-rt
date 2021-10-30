import React from 'react';
declare global {
    interface Window {
        hljs: any;
        prettier: any;
        prettierPlugins: any;
        Cropper: any;
        screenfull: any;
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
    codeRow?: string;
    code?: string;
    link?: string;
    image?: string;
    table?: string;
    revoke?: string;
    next?: string;
    save?: string;
    prettier?: string;
    pageFullscreen?: string;
    fullscreen?: string;
    preview?: string;
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
        title?: string;
        descLable?: string;
        descLablePlaceHolder?: string;
        urlLable?: string;
        UrlLablePlaceHolder?: string;
        buttonOK?: string;
    };
    clipModalTips?: {
        title?: string;
        buttonUpload?: string;
    };
    copyCode?: {
        text?: string;
        tips?: string;
    };
}
export interface StaticTextDefault {
    'zh-CN': StaticTextDefaultValue;
    'en-US': StaticTextDefaultValue;
}
export declare type StaticTextDefaultKey = keyof StaticTextDefault;
export declare type ToolbarNames = keyof ToolbarTips;
export interface SettingType {
    pageFullScreen: boolean;
    fullscreen: boolean;
    preview: boolean;
    htmlPreview: boolean;
}
export interface HeadList {
    text: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
}
export declare type PreviewThemes = 'default' | 'github' | 'vuepress';
export declare type MarkedHeading = (text: string, level: 1 | 2 | 3 | 4 | 5 | 6, raw: string, slugger: {
    seen: {
        [slugValue: string]: number;
    };
    slug(value: string, options?: {
        dryrun: boolean;
    }): string;
}) => string;
export interface EditorProp {
    modelValue: string;
    theme: 'light' | 'dark';
    editorClass: string;
    hljs?: any;
    highlightJs: string;
    highlightCss: string;
    historyLength: number;
    onChange: (v: string) => void;
    onSave?: (v: string) => void;
    onUploadImg?: (files: FileList, callBack: (urls: string[]) => void) => void;
    pageFullScreen: boolean;
    preview: boolean;
    htmlPreview: boolean;
    previewOnly: boolean;
    language: StaticTextDefaultKey | string;
    languageUserDefined?: {
        [key: string]: StaticTextDefaultValue;
    };
    toolbars: Array<ToolbarNames>;
    toolbarsExclude: Array<ToolbarNames>;
    prettier: boolean;
    prettierCDN: string;
    prettierMDCDN: string;
    onHtmlChanged?: (h: string) => void;
    Cropper?: any;
    cropperCss: string;
    cropperJs: string;
    iconfontJs: string;
    onGetCatalog?: (list: HeadList[]) => void;
    editorId: string;
    tabWidth: number;
    showCodeRowNumber: boolean;
    screenfull?: any;
    screenfullJs: string;
    previewTheme: PreviewThemes;
    markedHeading: MarkedHeading;
}
export interface ContentType {
    editorId: string;
    tabWidth: number;
    historyLength: number;
    previewOnly: boolean;
    showCodeRowNumber: boolean;
    usedLanguageText: StaticTextDefaultValue;
    Cropper: any;
    previewTheme: PreviewThemes;
}
export declare const EditorContext: React.Context<ContentType>;
declare const Editor: {
    (props: EditorProp): JSX.Element;
    defaultProps: EditorProp;
};
export default Editor;
