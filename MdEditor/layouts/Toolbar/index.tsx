import React, {
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState
} from 'react';
import { ToolbarNames, SettingType } from '../../type';
import { EditorContext } from '../../Editor';
import { goto } from '../../utils';
import { ToolDirective } from '../../utils/content-help';
import { allToolbar, prefix } from '../../config';
import bus from '../../utils/event-bus';
import Divider from '../../components/Divider';
import Dropdown from '../../components/Dropdown';
import Modals from '../Modals';
import TableShape from './TableShape';
import { useSreenfull, useModals, useDropdownState } from './hooks';

export interface ToolbarProp {
  noPrettier: boolean;
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
  setting: SettingType;
  updateSetting: (k: keyof SettingType, shouldScreenFull?: boolean) => void;
  tableShape: [number, number];
  defToolbars?: Array<ReactElement>;
}

let splitNum = 0;

const Toolbar = (props: ToolbarProp) => {
  const { toolbars, toolbarsExclude, setting, updateSetting } = props;
  // 获取ID，语言设置
  const { editorId, usedLanguageText } = useContext(EditorContext);
  const ult = usedLanguageText;

  const [wrapperId] = useState(() => `${editorId}-toolbar-wrapper`);
  // 文件选择
  const uploadRef = useRef<HTMLInputElement>(null);

  // bar触发事件
  const emitHandler = useCallback((direct: ToolDirective, params?: any) => {
    bus.emit(editorId, 'replace', direct, params);
  }, []);

  // 全屏功能
  const { fullScreenHandler } = useSreenfull(props);
  // 多弹窗控制
  const { modalData, setModalData, onCancel, onOk } = useModals(uploadRef, emitHandler);
  // 下拉菜单控制
  const {
    visible,
    onTitleChange,
    onTitleClose,
    onImageChange,
    onImageClose,
    onTableChange,
    onTableSelected,
    onMermaidChange,
    onMermaidClose,
    onKatexChange,
    onKatexClose
  } = useDropdownState(emitHandler);

  const TitleDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.title}
        onChange={onTitleChange}
        overlay={
          <ul className={`${prefix}-menu`} onClick={onTitleClose}>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h1');
              }}
            >
              {ult.titleItem?.h1}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h2');
              }}
            >
              {ult.titleItem?.h2}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h3');
              }}
            >
              {ult.titleItem?.h3}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h4');
              }}
            >
              {ult.titleItem?.h4}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h5');
              }}
            >
              {ult.titleItem?.h5}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('h6');
              }}
            >
              {ult.titleItem?.h6}
            </li>
          </ul>
        }
        key="bar-title"
      >
        <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.title}>
          <svg className={`${prefix}-icon`} aria-hidden="true">
            <use xlinkHref="#icon-title" />
          </svg>
        </div>
      </Dropdown>
    );
  }, [ult, visible.title, onTitleChange, onTitleClose]);

  const ImageDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.image}
        onChange={onImageChange}
        overlay={
          <ul className={`${prefix}-menu`} onClick={onImageClose}>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                setModalData((_modalData) => {
                  return {
                    ..._modalData,
                    type: 'image',
                    linkVisible: true
                  };
                });
              }}
            >
              {ult.imgTitleItem?.link}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                (uploadRef.current as HTMLInputElement).click();
              }}
            >
              {ult.imgTitleItem?.upload}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                setModalData({
                  ...modalData,
                  type: 'image',
                  clipVisible: true
                });
              }}
            >
              {ult.imgTitleItem?.clip2upload}
            </li>
          </ul>
        }
        key="bar-image"
      >
        <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.image}>
          <svg className={`${prefix}-icon`} aria-hidden="true">
            <use xlinkHref="#icon-image" />
          </svg>
        </div>
      </Dropdown>
    );
  }, [ult, visible.image, onImageChange, onImageClose]);

  const TableDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.table}
        onChange={onTableChange}
        key="bar-table"
        overlay={
          <TableShape tableShape={props.tableShape} onSelected={onTableSelected} />
        }
      >
        <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.table}>
          <svg className={`${prefix}-icon`} aria-hidden="true">
            <use xlinkHref="#icon-table" />
          </svg>
        </div>
      </Dropdown>
    );
  }, [ult, visible.table, props.tableShape, onTableChange, onTableSelected]);

  const MermaidDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.mermaid}
        onChange={onMermaidChange}
        overlay={
          <ul className={`${prefix}-menu`} onClick={onMermaidClose}>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('flow');
              }}
            >
              {ult.mermaid?.flow}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('sequence');
              }}
            >
              {ult.mermaid?.sequence}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('gantt');
              }}
            >
              {ult.mermaid?.gantt}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('class');
              }}
            >
              {ult.mermaid?.class}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('state');
              }}
            >
              {ult.mermaid?.state}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('pie');
              }}
            >
              {ult.mermaid?.pie}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('relationship');
              }}
            >
              {ult.mermaid?.relationship}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('journey');
              }}
            >
              {ult.mermaid?.journey}
            </li>
          </ul>
        }
        key="bar-mermaid"
      >
        <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.mermaid}>
          <svg className={`${prefix}-icon`} aria-hidden="true">
            <use xlinkHref="#icon-mermaid" />
          </svg>
        </div>
      </Dropdown>
    );
  }, [ult, visible.mermaid, onMermaidChange, onMermaidClose]);

  const KatexDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.katex}
        onChange={onKatexChange}
        overlay={
          <ul className={`${prefix}-menu`} onClick={onKatexClose}>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('katexInline');
              }}
            >
              {ult.katex?.inline}
            </li>
            <li
              className={`${prefix}-menu-item`}
              onClick={() => {
                emitHandler('katexBlock');
              }}
            >
              {ult.katex?.block}
            </li>
          </ul>
        }
        key="bar-katex"
      >
        <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.katex}>
          <svg className={`${prefix}-icon`} aria-hidden="true">
            <use xlinkHref="#icon-formula" />
          </svg>
        </div>
      </Dropdown>
    );
  }, [ult, visible.katex, onKatexChange, onKatexClose]);

  const barRender = useCallback(
    (barItem: ToolbarNames) => {
      if (allToolbar.includes(barItem)) {
        switch (barItem) {
          case '-': {
            return <Divider key={`bar-${splitNum++}`} />;
          }
          case 'bold': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.bold}
                onClick={() => {
                  emitHandler('bold');
                }}
                key="bar-bold"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-bold" />
                </svg>
              </div>
            );
          }
          case 'underline': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.underline}
                onClick={() => {
                  emitHandler('underline');
                }}
                key="bar-underline"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-underline" />
                </svg>
              </div>
            );
          }
          case 'italic': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.italic}
                onClick={() => {
                  emitHandler('italic');
                }}
                key="bar-italic"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-italic" />
                </svg>
              </div>
            );
          }
          case 'strikeThrough': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.strikeThrough}
                onClick={() => {
                  emitHandler('strikeThrough');
                }}
                key="bar-strikeThrough"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-strike-through" />
                </svg>
              </div>
            );
          }
          case 'title': {
            return TitleDropdown;
          }
          case 'sub': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.sub}
                onClick={() => {
                  emitHandler('sub');
                }}
                key="bar-sub"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-sub" />
                </svg>
              </div>
            );
          }
          case 'sup': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.sup}
                onClick={() => {
                  emitHandler('sup');
                }}
                key="bar-sup"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-sup" />
                </svg>
              </div>
            );
          }
          case 'quote': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.quote}
                onClick={() => {
                  emitHandler('quote');
                }}
                key="bar-quote"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-quote" />
                </svg>
              </div>
            );
          }
          case 'unorderedList': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.unorderedList}
                onClick={() => {
                  emitHandler('unorderedList');
                }}
                key="bar-unorderedList"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-unordered-list" />
                </svg>
              </div>
            );
          }
          case 'orderedList': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.orderedList}
                onClick={() => {
                  emitHandler('orderedList');
                }}
                key="bar-orderedList"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-ordered-list" />
                </svg>
              </div>
            );
          }
          case 'codeRow': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.codeRow}
                onClick={() => {
                  emitHandler('codeRow');
                }}
                key="bar-codeRow"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-code-row" />
                </svg>
              </div>
            );
          }
          case 'code': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.code}
                onClick={() => {
                  emitHandler('code');
                }}
                key="bar-code"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-code" />
                </svg>
              </div>
            );
          }
          case 'link': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.link}
                onClick={() => {
                  setModalData({
                    ...modalData,
                    type: 'link',
                    linkVisible: true
                  });
                }}
                key="bar-link"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-link" />
                </svg>
              </div>
            );
          }
          case 'image': {
            return ImageDropdown;
          }
          case 'table': {
            return TableDropdown;
          }
          case 'revoke': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.revoke}
                onClick={() => {
                  bus.emit(editorId, 'ctrlZ');
                }}
                key="bar-revoke"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-revoke" />
                </svg>
              </div>
            );
          }
          case 'next': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.next}
                onClick={() => {
                  bus.emit(editorId, 'ctrlShiftZ');
                }}
                key="bar-next"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-next" />
                </svg>
              </div>
            );
          }
          case 'save': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.save}
                onClick={() => {
                  bus.emit(editorId, 'onSave');
                }}
                key="bar-save"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-baocun" />
                </svg>
              </div>
            );
          }
          case 'prettier': {
            return props.noPrettier ? (
              ''
            ) : (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.prettier}
                onClick={() => {
                  emitHandler('prettier');
                }}
                key="bar-prettier"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-prettier" />
                </svg>
              </div>
            );
          }
          case 'pageFullscreen': {
            return (
              !setting.fullscreen && (
                <div
                  className={`${prefix}-toolbar-item`}
                  title={ult.toolbarTips?.pageFullscreen}
                  onClick={() => {
                    updateSetting('pageFullScreen');
                  }}
                  key="bar-pageFullscreen"
                >
                  <svg className={`${prefix}-icon`} aria-hidden="true">
                    <use
                      xlinkHref={`#icon-${setting.pageFullScreen ? 'suoxiao' : 'fangda'}`}
                    />
                  </svg>
                </div>
              )
            );
          }
          case 'fullscreen': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.fullscreen}
                onClick={fullScreenHandler}
                key="bar-fullscreen"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use
                    xlinkHref={`#icon-${
                      setting.fullscreen ? 'fullScreen-exit' : 'fullScreen'
                    }`}
                  />
                </svg>
              </div>
            );
          }
          case 'catalog': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.catalog}
                onClick={() => {
                  bus.emit(editorId, 'catalogShow');
                }}
                key="bar-catalog"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-catalog" />
                </svg>
              </div>
            );
          }
          case 'preview': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.preview}
                onClick={() => {
                  updateSetting('preview');
                }}
                key="bar-preview"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-preview" />
                </svg>
              </div>
            );
          }
          case 'htmlPreview': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.htmlPreview}
                onClick={() => {
                  updateSetting('htmlPreview');
                }}
                key="bar-htmlPreview"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-coding" />
                </svg>
              </div>
            );
          }
          case 'github': {
            return (
              <div
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.github}
                onClick={() => goto('https://github.com/imzbf/md-editor-rt')}
                key="bar-github"
              >
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-github" />
                </svg>
              </div>
            );
          }
          case 'mermaid': {
            return MermaidDropdown;
          }
          case 'katex': {
            return KatexDropdown;
          }
        }
      } else if (props.defToolbars && props.defToolbars instanceof Array) {
        const defItem = props.defToolbars[barItem as number];

        return defItem || '';
      } else {
        return '';
      }
    },
    [props.defToolbars, ult, visible, setting.pageFullScreen, setting.fullscreen]
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

  return (
    <div className={`${prefix}-toolbar-wrapper`} id={wrapperId}>
      <div
        className={`${prefix}-toolbar`}
        onMouseEnter={() => {
          // 工具栏操作前，保存选中文本
          bus.emit(editorId, 'selectTextChange');
        }}
      >
        <div className={`${prefix}-toolbar-left`}>{splitedbar[0]}</div>
        <div className={`${prefix}-toolbar-right`}>{splitedbar[1]}</div>
      </div>
      <input
        ref={uploadRef}
        accept="image/*"
        type="file"
        multiple={true}
        style={{ display: 'none' }}
      />
      <Modals
        linkVisible={modalData.linkVisible}
        clipVisible={modalData.clipVisible}
        type={modalData.type}
        onCancel={onCancel}
        onOk={onOk}
      />
    </div>
  );
};

export default React.memo(Toolbar);
