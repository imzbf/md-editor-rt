import Editor from './Editor';
import NormalToolbar from './extensions/NormalToolbar';
import DropdownToolbar from './extensions/DropdownToolbar';
import MdCatalog from './extensions/MdCatalog';
import ModalToolbar from './extensions/ModalToolbar';

import { config } from './config';

(Editor as any).NormalToolbar = NormalToolbar;
(Editor as any).DropdownToolbar = DropdownToolbar;
(Editor as any).MdCatalog = MdCatalog;
(Editor as any).ModalToolbar = ModalToolbar;
(Editor as any).config = config;

export default Editor as typeof Editor & {
  /**
   * 默认工具栏组件
   */
  readonly NormalToolbar: typeof NormalToolbar;
  /**
   * 下拉菜单工具栏组件
   */
  readonly DropdownToolbar: typeof DropdownToolbar;
  /**
   * 目录组件
   */
  readonly MdCatalog: typeof MdCatalog;
  /**
   * 弹窗工具栏组件
   */
  readonly ModalToolbar: typeof ModalToolbar;
  /**
   * 配置编辑器全局内容
   */
  readonly config: typeof config;
};

export * from './type';
