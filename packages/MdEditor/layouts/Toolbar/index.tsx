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
import { linkTo, draggingScroll } from '@vavt/util';
import {
  ToolbarNames,
  SettingType,
  UpdateSetting,
  InsertContentGenerator,
  TableShapeType
} from '~/type';
import { EditorContext } from '~/context';
import { ToolDirective } from '~/utils/content-help';
import { allToolbar, prefix } from '~/config';
import {
  CHANGE_CATALOG_VISIBLE,
  CTRL_SHIFT_Z,
  CTRL_Z,
  ON_SAVE,
  REPLACE
} from '~/static/event-name';
import { classnames } from '~/utils';

import bus from '~/utils/event-bus';
import Divider from '~/components/Divider';
import Dropdown from '~/components/Dropdown';
import Icon from '~/components/Icon';

import Modals from '../Modals';
import TableShape from './TableShape';
import { useSreenfull, useModals, useDropdownState } from './hooks';

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
  const { toolbars, toolbarsExclude, updateSetting, codeTheme } = props;
  // 获取ID，语言设置
  const { editorId, usedLanguageText, theme, previewTheme, language, disabled } =
    useContext(EditorContext);
  const ult = usedLanguageText;

  const [wrapperId] = useState(() => `${editorId}-toolbar-wrapper`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 文件选择
  const uploadRef = useRef<HTMLInputElement>(null);

  // bar触发事件
  const emitHandler = useCallback(
    (direct: ToolDirective, params?: any) => {
      if (disabled) {
        return false;
      }
      bus.emit(editorId, REPLACE, direct, params);
    },
    [disabled, editorId]
  );

  // 全屏功能
  const { fullscreenHandler } = useSreenfull(props);
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
          <ul
            key="bar-title-overlay"
            className={`${prefix}-menu`}
            onClick={onTitleClose}
            role="menu"
          >
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h1');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h1}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h2');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h2}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h3');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h3}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h4');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h4}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h5');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h5}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-title`}
              onClick={() => {
                emitHandler('h6');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.titleItem?.h6}
            </li>
          </ul>
        }
        disabled={disabled}
        key="bar-title"
      >
        <div
          key="bar-title-trigger"
          className={classnames([
            `${prefix}-toolbar-item`,
            disabled && `${prefix}-disabled`
          ])}
          title={ult.toolbarTips?.title}
        >
          <Icon name="title" />

          {props.showToolbarName && (
            <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.title}</div>
          )}
        </div>
      </Dropdown>
    );
  }, [
    wrapperId,
    visible.title,
    onTitleChange,
    onTitleClose,
    ult.titleItem?.h1,
    ult.titleItem?.h2,
    ult.titleItem?.h3,
    ult.titleItem?.h4,
    ult.titleItem?.h5,
    ult.titleItem?.h6,
    ult.toolbarTips?.title,
    disabled,
    props.showToolbarName,
    emitHandler
  ]);

  const ImageDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.image}
        onChange={onImageChange}
        overlay={
          <ul
            key="bar-image-overlay"
            className={`${prefix}-menu`}
            onClick={onImageClose}
            role="menu"
          >
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-image`}
              onClick={() => {
                setModalData((_modalData) => {
                  return {
                    ..._modalData,
                    type: 'image',
                    linkVisible: true
                  };
                });
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.imgTitleItem?.link}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-image`}
              onClick={() => {
                (uploadRef.current as HTMLInputElement).click();
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.imgTitleItem?.upload}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-image`}
              onClick={() => {
                setModalData((_modalData) => {
                  return {
                    ..._modalData,
                    type: 'image',
                    clipVisible: true
                  };
                });
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.imgTitleItem?.clip2upload}
            </li>
          </ul>
        }
        disabled={disabled}
        key="bar-image"
      >
        <div
          key="bar-image-trigger"
          className={classnames([
            `${prefix}-toolbar-item`,
            disabled && `${prefix}-disabled`
          ])}
          title={ult.toolbarTips?.image}
        >
          <Icon name="image" />

          {props.showToolbarName && (
            <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.image}</div>
          )}
        </div>
      </Dropdown>
    );
  }, [
    wrapperId,
    visible.image,
    onImageChange,
    onImageClose,
    ult.imgTitleItem?.link,
    ult.imgTitleItem?.upload,
    ult.imgTitleItem?.clip2upload,
    ult.toolbarTips?.image,
    disabled,
    props.showToolbarName,
    setModalData
  ]);

  const TableDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.table}
        onChange={onTableChange}
        disabled={disabled}
        key="bar-table"
        overlay={
          <TableShape
            key="bar-table-overlay"
            tableShape={props.tableShape}
            onSelected={onTableSelected}
          />
        }
      >
        <div
          key="bar-table-trigger"
          className={classnames([
            `${prefix}-toolbar-item`,
            disabled && `${prefix}-disabled`
          ])}
          title={ult.toolbarTips?.table}
        >
          <Icon name="table" />

          {props.showToolbarName && (
            <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.table}</div>
          )}
        </div>
      </Dropdown>
    );
  }, [
    wrapperId,
    visible.table,
    onTableChange,
    disabled,
    props.tableShape,
    props.showToolbarName,
    onTableSelected,
    ult.toolbarTips?.table
  ]);

  const MermaidDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.mermaid}
        onChange={onMermaidChange}
        overlay={
          <ul
            key="bar-mermaid-overlay"
            className={`${prefix}-menu`}
            onClick={onMermaidClose}
            role="menu"
          >
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('flow');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.flow}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('sequence');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.sequence}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('gantt');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.gantt}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('class');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.class}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('state');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.state}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('pie');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.pie}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('relationship');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.relationship}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
              onClick={() => {
                emitHandler('journey');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.mermaid?.journey}
            </li>
          </ul>
        }
        disabled={disabled}
        key="bar-mermaid"
      >
        <div
          key="bar-mermaid-trigger"
          className={classnames([
            `${prefix}-toolbar-item`,
            disabled && `${prefix}-disabled`
          ])}
          title={ult.toolbarTips?.mermaid}
        >
          <Icon name="mermaid" />

          {props.showToolbarName && (
            <div className={`${prefix}-toolbar-item-name`}>
              {ult.toolbarTips?.mermaid}
            </div>
          )}
        </div>
      </Dropdown>
    );
  }, [
    wrapperId,
    visible.mermaid,
    onMermaidChange,
    onMermaidClose,
    ult.mermaid?.flow,
    ult.mermaid?.sequence,
    ult.mermaid?.gantt,
    ult.mermaid?.class,
    ult.mermaid?.state,
    ult.mermaid?.pie,
    ult.mermaid?.relationship,
    ult.mermaid?.journey,
    ult.toolbarTips?.mermaid,
    disabled,
    props.showToolbarName,
    emitHandler
  ]);

  const KatexDropdown = useMemo(() => {
    return (
      <Dropdown
        relative={`#${wrapperId}`}
        visible={visible.katex}
        onChange={onKatexChange}
        overlay={
          <ul
            key="bar-katex-overlay"
            className={`${prefix}-menu`}
            onClick={onKatexClose}
            role="menu"
          >
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-katex`}
              onClick={() => {
                emitHandler('katexInline');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.katex?.inline}
            </li>
            <li
              className={`${prefix}-menu-item ${prefix}-menu-item-katex`}
              onClick={() => {
                emitHandler('katexBlock');
              }}
              role="menuitem"
              tabIndex={0}
            >
              {ult.katex?.block}
            </li>
          </ul>
        }
        disabled={disabled}
        key="bar-katex"
      >
        <div
          key="bar-katex-trigger"
          className={classnames([
            `${prefix}-toolbar-item`,
            disabled && `${prefix}-disabled`
          ])}
          title={ult.toolbarTips?.katex}
        >
          <Icon name="formula" />

          {props.showToolbarName && (
            <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.katex}</div>
          )}
        </div>
      </Dropdown>
    );
  }, [
    wrapperId,
    visible.katex,
    onKatexChange,
    onKatexClose,
    ult.katex?.inline,
    ult.katex?.block,
    ult.toolbarTips?.katex,
    disabled,
    props.showToolbarName,
    emitHandler
  ]);

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
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.bold}
                onClick={() => {
                  emitHandler('bold');
                }}
                key="bar-bold"
              >
                <Icon name="bold" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.bold}
                  </div>
                )}
              </div>
            );
          }
          case 'underline': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.underline}
                onClick={() => {
                  emitHandler('underline');
                }}
                key="bar-underline"
              >
                <Icon name="underline" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.underline}
                  </div>
                )}
              </div>
            );
          }
          case 'italic': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.italic}
                onClick={() => {
                  emitHandler('italic');
                }}
                key="bar-italic"
              >
                <Icon name="italic" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.italic}
                  </div>
                )}
              </div>
            );
          }
          case 'strikeThrough': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.strikeThrough}
                onClick={() => {
                  emitHandler('strikeThrough');
                }}
                key="bar-strikeThrough"
              >
                <Icon name="strike-through" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.strikeThrough}
                  </div>
                )}
              </div>
            );
          }
          case 'title': {
            return TitleDropdown;
          }
          case 'sub': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.sub}
                onClick={() => {
                  emitHandler('sub');
                }}
                key="bar-sub"
              >
                <Icon name="sub" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.sub}
                  </div>
                )}
              </div>
            );
          }
          case 'sup': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.sup}
                onClick={() => {
                  emitHandler('sup');
                }}
                key="bar-sup"
              >
                <Icon name="sup" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.sup}
                  </div>
                )}
              </div>
            );
          }
          case 'quote': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.quote}
                onClick={() => {
                  emitHandler('quote');
                }}
                key="bar-quote"
              >
                <Icon name="quote" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.quote}
                  </div>
                )}
              </div>
            );
          }
          case 'unorderedList': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.unorderedList}
                onClick={() => {
                  emitHandler('unorderedList');
                }}
                key="bar-unorderedList"
              >
                <Icon name="unordered-list" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.unorderedList}
                  </div>
                )}
              </div>
            );
          }
          case 'orderedList': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.orderedList}
                onClick={() => {
                  emitHandler('orderedList');
                }}
                key="bar-orderedList"
              >
                <Icon name="ordered-list" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.orderedList}
                  </div>
                )}
              </div>
            );
          }

          case 'task': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.task}
                onClick={() => {
                  emitHandler('task');
                }}
                key="bar-task"
              >
                <Icon name="task" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.task}
                  </div>
                )}
              </div>
            );
          }

          case 'codeRow': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.codeRow}
                onClick={() => {
                  emitHandler('codeRow');
                }}
                key="bar-codeRow"
              >
                <Icon name="code-row" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.codeRow}
                  </div>
                )}
              </div>
            );
          }
          case 'code': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.code}
                onClick={() => {
                  emitHandler('code');
                }}
                key="bar-code"
              >
                <Icon name="code" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.code}
                  </div>
                )}
              </div>
            );
          }
          case 'link': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.link}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  setModalData({
                    ...modalData,
                    type: 'link',
                    linkVisible: true
                  });
                }}
                key="bar-link"
              >
                <Icon name="link" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.link}
                  </div>
                )}
              </div>
            );
          }
          case 'image': {
            return props.noUploadImg ? (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.image}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }

                  setModalData((_modalData) => {
                    return {
                      ..._modalData,
                      type: 'image',
                      linkVisible: true
                    };
                  });
                }}
                key="bar-image-no-upload"
              >
                <Icon name="image" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.image}
                  </div>
                )}
              </div>
            ) : (
              ImageDropdown
            );
          }
          case 'table': {
            return TableDropdown;
          }
          case 'revoke': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.revoke}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  bus.emit(editorId, CTRL_Z);
                }}
                key="bar-revoke"
              >
                <Icon name="revoke" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.revoke}
                  </div>
                )}
              </div>
            );
          }
          case 'next': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.next}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  bus.emit(editorId, CTRL_SHIFT_Z);
                }}
                key="bar-next"
              >
                <Icon name="next" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.next}
                  </div>
                )}
              </div>
            );
          }
          case 'save': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.save}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  bus.emit(editorId, ON_SAVE);
                }}
                key="bar-save"
              >
                <Icon name="save" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.save}
                  </div>
                )}
              </div>
            );
          }
          case 'prettier': {
            return props.noPrettier ? (
              ''
            ) : (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.prettier}
                onClick={() => {
                  emitHandler('prettier');
                }}
                key="bar-prettier"
              >
                <Icon name="prettier" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.prettier}
                  </div>
                )}
              </div>
            );
          }
          case 'pageFullscreen': {
            return (
              !props.setting.fullscreen && (
                <div
                  className={classnames([
                    `${prefix}-toolbar-item`,
                    props.setting.pageFullscreen && `${prefix}-toolbar-active`,
                    disabled && `${prefix}-disabled`
                  ])}
                  title={ult.toolbarTips?.pageFullscreen}
                  onClick={() => {
                    if (disabled) {
                      return false;
                    }
                    updateSetting('pageFullscreen');
                  }}
                  key="bar-pageFullscreen"
                >
                  <Icon name={props.setting.pageFullscreen ? 'minimize' : 'maximize'} />

                  {props.showToolbarName && (
                    <div className={`${prefix}-toolbar-item-name`}>
                      {ult.toolbarTips?.pageFullscreen}
                    </div>
                  )}
                </div>
              )
            );
          }
          case 'fullscreen': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  props.setting.fullscreen && `${prefix}-toolbar-active`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.fullscreen}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  fullscreenHandler();
                }}
                key="bar-fullscreen"
              >
                <Icon
                  name={props.setting.fullscreen ? 'fullscreen-exit' : 'fullscreen'}
                />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.fullscreen}
                  </div>
                )}
              </div>
            );
          }
          case 'catalog': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  props.catalogVisible && `${prefix}-toolbar-active`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.catalog}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  bus.emit(editorId, CHANGE_CATALOG_VISIBLE);
                }}
                key="bar-catalog"
              >
                <Icon name="catalog" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.catalog}
                  </div>
                )}
              </div>
            );
          }
          case 'preview': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  props.setting.preview && `${prefix}-toolbar-active`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.preview}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  updateSetting('preview');
                }}
                key="bar-preview"
              >
                <Icon name="preview" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.preview}
                  </div>
                )}
              </div>
            );
          }
          case 'previewOnly': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  props.setting.previewOnly && `${prefix}-toolbar-active`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.previewOnly}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  updateSetting('previewOnly');
                }}
                key="bar-preview-only"
              >
                <Icon name="preview-only" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.previewOnly}
                  </div>
                )}
              </div>
            );
          }
          case 'htmlPreview': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  props.setting.htmlPreview && `${prefix}-toolbar-active`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.htmlPreview}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  updateSetting('htmlPreview');
                }}
                key="bar-htmlPreview"
              >
                <Icon name="preview-html" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.htmlPreview}
                  </div>
                )}
              </div>
            );
          }
          case 'github': {
            return (
              <div
                className={classnames([
                  `${prefix}-toolbar-item`,
                  disabled && `${prefix}-disabled`
                ])}
                title={ult.toolbarTips?.github}
                onClick={() => {
                  if (disabled) {
                    return false;
                  }
                  linkTo('https://github.com/imzbf/md-editor-rt');
                }}
                key="bar-github"
              >
                <Icon name="github" />

                {props.showToolbarName && (
                  <div className={`${prefix}-toolbar-item-name`}>
                    {ult.toolbarTips?.github}
                  </div>
                )}
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
    [
      props,
      disabled,
      ult.toolbarTips?.bold,
      ult.toolbarTips?.underline,
      ult.toolbarTips?.italic,
      ult.toolbarTips?.strikeThrough,
      ult.toolbarTips?.sub,
      ult.toolbarTips?.sup,
      ult.toolbarTips?.quote,
      ult.toolbarTips?.unorderedList,
      ult.toolbarTips?.orderedList,
      ult.toolbarTips?.task,
      ult.toolbarTips?.codeRow,
      ult.toolbarTips?.code,
      ult.toolbarTips?.link,
      ult.toolbarTips?.image,
      ult.toolbarTips?.revoke,
      ult.toolbarTips?.next,
      ult.toolbarTips?.save,
      ult.toolbarTips?.prettier,
      ult.toolbarTips?.pageFullscreen,
      ult.toolbarTips?.fullscreen,
      ult.toolbarTips?.catalog,
      ult.toolbarTips?.preview,
      ult.toolbarTips?.previewOnly,
      ult.toolbarTips?.htmlPreview,
      ult.toolbarTips?.github,
      emitHandler,
      TitleDropdown,
      setModalData,
      modalData,
      ImageDropdown,
      TableDropdown,
      editorId,
      updateSetting,
      fullscreenHandler,
      MermaidDropdown,
      KatexDropdown,
      theme,
      codeTheme,
      previewTheme,
      language
    ]
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
      <label
        htmlFor={`${wrapperId}_label`}
        style={{ display: 'none' }}
        aria-label={ult.imgTitleItem?.upload}
      ></label>
      <input
        id={`${wrapperId}_label`}
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
    </>
  );
};

export default memo(Toolbar);
