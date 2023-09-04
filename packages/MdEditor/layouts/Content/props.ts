import { CompletionSource } from '@codemirror/autocomplete';
import { HeadList, MdHeadingId, SettingType, Themes } from '~/type';

export interface ContentPreviewProps {
  modelValue: string;
  setting: SettingType;
  onHtmlChanged?: (h: string) => void;
  onGetCatalog?: (list: HeadList[]) => void;
  mdHeadingId: MdHeadingId;
  noMermaid?: boolean;
  sanitize: (html: string) => string;
  noKatex?: boolean;
  formatCopiedText?: (text: string) => string;
  noHighlight?: boolean;
  previewOnly?: boolean;
  noImgZoomIn?: boolean;
}

export type ContentProps = Readonly<
  {
    onChange: (v: string) => void;
    placeholder: string;
    scrollAuto: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    maxLength?: number;
    autoDetectCode?: boolean;
    /**
     * 输入框失去焦点时触发事件
     */
    onBlur?: (event: FocusEvent) => void;
    /**
     * 输入框获得焦点时触发事件
     */
    onFocus?: (event: FocusEvent) => void;
    noPrettier?: boolean;
    completions?: Array<CompletionSource>;
    catalogVisible: boolean;
    theme?: Themes;
    onInput?: (e: Event) => void;
    /**
     * 拖放事件
     *
     * @param event
     * @returns
     */
    onDrop?: (event: DragEvent) => void;
  } & ContentPreviewProps
>;
