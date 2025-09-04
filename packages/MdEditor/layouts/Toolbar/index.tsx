import { draggingScroll } from '@vavt/util';
import {
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  cloneElement,
  useEffect,
  memo
} from 'react';
import Divider from '~/components/Divider';
import { allToolbar, prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import {
  ToolbarNames,
  SettingType,
  UpdateSetting,
  InsertContentGenerator,
  TableShapeType
} from '~/type';
import { classnames } from '~/utils';

import bus from '~/utils/event-bus';

import ToolbarBold from './tools/Bold';
import ToolbarCatalog from './tools/Catalog';
import ToolbarCode from './tools/Code';
import ToolbarCodeRow from './tools/CodeRow';
import ToolbarFullscreen from './tools/Fullscreen';
import ToolbarGithub from './tools/Github';
import ToolbarHtmlPreview from './tools/HtmlPreview';
import ToolbarImage from './tools/Image';
import ToolbarImageDropdown from './tools/ImageDropdown';
import ToolbarItalic from './tools/Italic';
import ToolbarKatex from './tools/Katex';
import ToolbarLink from './tools/Link';
import ToolbarMermaid from './tools/Mermaid';
import ToolbarNext from './tools/Next';
import ToolbarOrderedList from './tools/OrderedList';
import ToolbarPageFullscreen from './tools/PageFullscreen';
import ToolbarPrettier from './tools/Prettier';
import ToolbarPreview from './tools/Preview';
import ToolbarPreviewOnly from './tools/PreviewOnly';
import ToolbarQuote from './tools/Quote';
import ToolbarRevoke from './tools/Revoke';
import ToolbarSave from './tools/Save';
import ToolbarStrikeThrough from './tools/StrikeThrough';
import ToolbarSub from './tools/Sub';
import ToolbarSup from './tools/Sup';
import ToolbarTable from './tools/Table';
import ToolbarTask from './tools/Task';
import ToolbarTitle from './tools/Title';
import ToolbarUnderline from './tools/Underline';
import ToolbarUnorderedList from './tools/UnorderedList';

export interface ToolbarProps {
  noPrettier: boolean;
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
  setting: SettingType;
  updateSetting: UpdateSetting; // (k: keyof SettingType, shouldScreenFull?: boolean) => void;
  tableShape: TableShapeType;
  defToolbars?: Array<ReactElement>;
  noUploadImg: boolean;
  showToolbarName?: boolean;
  catalogVisible: boolean;
  codeTheme: string;
}

let splitNum = 0;

const Toolbar = (props: ToolbarProps) => {
  const { toolbars, toolbarsExclude, codeTheme } = props;
  // 获取ID，语言设置
  const { editorId, theme, previewTheme, language, disabled } = useContext(EditorContext);

  const [wrapperId] = useState(() => `${editorId}-toolbar-wrapper`);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const barRender = useCallback(
    (barItem: ToolbarNames) => {
      if (allToolbar.includes(barItem)) {
        switch (barItem) {
          case '-': {
            return <Divider key={`bar-${splitNum++}`} />;
          }
          case 'bold': {
            return <ToolbarBold key="bar-bold" />;
          }
          case 'underline': {
            return <ToolbarUnderline key="bar-unorderline" />;
          }
          case 'italic': {
            return <ToolbarItalic key="bar-italic" />;
          }
          case 'strikeThrough': {
            return <ToolbarStrikeThrough key="bar-strikeThrough" />;
          }
          case 'title': {
            return <ToolbarTitle key="bar-title" />;
          }
          case 'sub': {
            return <ToolbarSub key="bar-sub" />;
          }
          case 'sup': {
            return <ToolbarSup key="bar-sup" />;
          }
          case 'quote': {
            return <ToolbarQuote key="bar-quote" />;
          }
          case 'unorderedList': {
            return <ToolbarUnorderedList key="bar-unorderedList" />;
          }
          case 'orderedList': {
            return <ToolbarOrderedList key="bar-orderedList" />;
          }
          case 'task': {
            return <ToolbarTask key="bar-task" />;
          }
          case 'codeRow': {
            return <ToolbarCodeRow key="bar-codeRow" />;
          }
          case 'code': {
            return <ToolbarCode key="bar-code" />;
          }
          case 'link': {
            return <ToolbarLink key="bar-link" />;
          }
          case 'image': {
            return props.noUploadImg ? (
              <ToolbarImage key="bar-image" />
            ) : (
              <ToolbarImageDropdown key="bar-imageDropdown" />
            );
          }
          case 'table': {
            return <ToolbarTable key="bar-table" />;
          }
          case 'revoke': {
            return <ToolbarRevoke key="bar-revoke" />;
          }
          case 'next': {
            return <ToolbarNext key="bar-next" />;
          }
          case 'save': {
            return <ToolbarSave key="bar-save" />;
          }
          case 'prettier': {
            return props.noPrettier && <ToolbarPrettier key="bar-prettier" />;
          }
          case 'pageFullscreen': {
            return (
              !props.setting.fullscreen && (
                <ToolbarPageFullscreen key="bar-pageFullscreen" />
              )
            );
          }
          case 'fullscreen': {
            return <ToolbarFullscreen key="bar-fullscreen" />;
          }
          case 'catalog': {
            return <ToolbarCatalog key="bar-catalog" />;
          }
          case 'preview': {
            return <ToolbarPreview key="bar-preview" />;
          }
          case 'previewOnly': {
            return <ToolbarPreviewOnly key="bar-previewOnly" />;
          }
          case 'htmlPreview': {
            return <ToolbarHtmlPreview key="bar-htmlPreview" />;
          }
          case 'github': {
            return <ToolbarGithub key="bar-github" />;
          }
          case 'mermaid': {
            return <ToolbarMermaid key="bar-mermaid" />;
          }
          case 'katex': {
            return <ToolbarKatex key="bar-katex" />;
          }
        }
      } else if (props.defToolbars) {
        const defItem = props.defToolbars[barItem as number];

        if (defItem) {
          const defItemCloned = cloneElement(defItem, {
            theme: defItem.props.theme || theme,
            codeTheme: defItem.props.codeTheme || codeTheme,
            previewTheme: defItem.props.previewTheme || previewTheme,
            language: defItem.props.language || language,
            disabled: defItem.props.disabled || disabled,
            showToolbarName: defItem.props.showToolbarName || props.showToolbarName,
            insert(generate: InsertContentGenerator) {
              bus.emit(editorId, REPLACE, 'universal', { generate });
            }
          });

          return defItemCloned;
        }

        return '';
      } else {
        return '';
      }
    },
    [props, disabled, editorId, theme, codeTheme, previewTheme, language]
  );

  // 通过'='分割左右
  const splitedbar = useMemo(() => {
    const excluedBars = toolbars.filter((barItem) => !toolbarsExclude.includes(barItem));
    const moduleSplitIndex = excluedBars.indexOf('=');

    // 左侧部分
    const barLeft =
      moduleSplitIndex === -1 ? excluedBars : excluedBars.slice(0, moduleSplitIndex + 1);

    const barRight =
      moduleSplitIndex === -1
        ? []
        : excluedBars.slice(moduleSplitIndex, Number.MAX_SAFE_INTEGER);

    return [
      barLeft.map((barItem) => barRender(barItem)),
      barRight.map((barItem) => barRender(barItem))
    ];
  }, [toolbars, toolbarsExclude, barRender]);

  useEffect(() => {
    let rl = () => {};

    if (wrapperRef.current) {
      rl = draggingScroll(wrapperRef.current);
    }

    return () => {
      rl();
    };
  }, [toolbars]);

  return (
    <>
      {toolbars.length > 0 && (
        <div className={`${prefix}-toolbar-wrapper`} ref={wrapperRef} id={wrapperId}>
          <div
            className={classnames([
              `${prefix}-toolbar`,
              props.showToolbarName! && `${prefix}-stn`
            ])}
          >
            <div className={`${prefix}-toolbar-left`}>{splitedbar[0]}</div>
            <div className={`${prefix}-toolbar-right`}>{splitedbar[1]}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Toolbar);
