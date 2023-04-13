import { FocusEvent } from 'react';
import { HeadList, MarkedHeadingId, SettingType } from '~/type';

export type ContentProps = Readonly<{
  value: string;
  onChange: (v: string) => void;
  setting: SettingType;
  onHtmlChanged?: (h: string) => void;
  onGetCatalog?: (list: HeadList[]) => void;
  // 不使用该功能
  noMermaid?: boolean;
  sanitize: (html: string) => string;
  placeholder: string;
  noKatex?: boolean;
  markedHeadingId: MarkedHeadingId;
  scrollAuto: boolean;
  formatCopiedText?: (text: string) => string;
  autoFocus?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  autoDetectCode?: boolean;
  /**
   * 输入框失去焦点时触发事件
   */
  onBlur?: (event: FocusEvent<HTMLTextAreaElement, Element>) => void;
  /**
   * 输入框获得焦点时触发事件
   */
  onFocus?: (event: FocusEvent<HTMLTextAreaElement, Element>) => void;
  noPrettier?: boolean;
}>;
