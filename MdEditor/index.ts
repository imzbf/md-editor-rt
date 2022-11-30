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
  readonly NormalToolbar: typeof NormalToolbar;
  readonly DropdownToolbar: typeof DropdownToolbar;
  readonly MdCatalog: typeof MdCatalog;
  readonly ModalToolbar: typeof ModalToolbar;
  readonly config: typeof config;
};

export * from './type';
