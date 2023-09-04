import React, {
  ReactElement,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  cloneElement,
  useEffect
} from 'react';
import { linkTo, draggingScroll } from '@vavt/util';
import { ToolbarNames, SettingType, UpdateSetting, InsertContentGenerator } from '~/type';
import { EditorContext } from '~/Editor';
import { ToolDirective } from '~/utils/content-help';
import { allToolbar, prefix } from '~/config';
import bus from '~/utils/event-bus';
import Divider from '~/components/Divider';
import Dropdown from '~/components/Dropdown';
import {
  CHANGE_CATALOG_VISIBLE,
  CTRL_SHIFT_Z,
  CTRL_Z,
  ON_SAVE,
  REPLACE
} from '~/static/event-name';
import Modals from '../Modals';
import TableShape from './TableShape';
import { useSreenfull, useModals, useDropdownState } from './hooks';
import { classnames } from '~/utils';
import Icon from '~/components/Icon';

export interface ToolbarProps {
  noPrettier: boolean;
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
  setting: SettingType;
  updateSetting: UpdateSetting; // (k: keyof SettingType, shouldScreenFull?: boolean) => void;
  tableShape: [number, number];
  defToolbars?: Array<ReactElement>;
  noUploadImg: boolean;
  showToolbarName?: boolean;
}

let splitNum = 0;

const Toolbar = (props: ToolbarProps) => {
  const { toolbars, toolbarsExclude, updateSetting } = props;
  // 获取ID，语言设置
  const { editorId, usedLanguageText } = useContext(EditorContext);
  const ult = usedLanguageText;

  const [wrapperId] = useState(() => `${editorId}-toolbar-wrapper`);
  const wrapperRef = useRef<HTMLDivElement>(null);
  // 文件选择
  const uploadRef = useRef<HTMLInputElement>(null);

  // bar触发事件
  const emitHandler = useCallback((direct: ToolDirective, params?: any) => {
    bus.emit(editorId, REPLACE, direct, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    ult.titleItem,
    ult.toolbarTips,
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
                setModalData((_modalData) => {
                  return {
                    ..._modalData,
                    type: 'image',
                    clipVisible: true
                  };
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
    ult.imgTitleItem,
    ult.toolbarTips,
    props.showToolbarName,
    setModalData
  ]);

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
    props.tableShape,
    props.showToolbarName,
    onTableSelected,
    ult.toolbarTips
  ]);

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
    ult.mermaid,
    ult.toolbarTips,
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
    ult.katex,
    ult.toolbarTips,
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.image}
                onClick={() => {
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.revoke}
                onClick={() => {
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.next}
                onClick={() => {
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.save}
                onClick={() => {
                  bus.emit(editorId, ON_SAVE);
                }}
                key="bar-save"
              >
                <Icon name="baocun" />

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
                className={`${prefix}-toolbar-item`}
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
                  className={`${prefix}-toolbar-item`}
                  title={ult.toolbarTips?.pageFullscreen}
                  onClick={() => {
                    updateSetting('pageFullscreen');
                  }}
                  key="bar-pageFullscreen"
                >
                  <Icon name={props.setting.pageFullscreen ? 'suoxiao' : 'fangda'} />

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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.fullscreen}
                onClick={() => {
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.catalog}
                onClick={() => {
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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.preview}
                onClick={() => {
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
                <Icon name="coding" />

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
                className={`${prefix}-toolbar-item`}
                title={ult.toolbarTips?.github}
                onClick={() => linkTo('https://github.com/imzbf/md-editor-rt')}
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
      ImageDropdown,
      KatexDropdown,
      MermaidDropdown,
      TableDropdown,
      TitleDropdown,
      editorId,
      emitHandler,
      fullscreenHandler,
      modalData,
      props.defToolbars,
      props.noPrettier,
      props.noUploadImg,
      props.setting.fullscreen,
      props.setting.pageFullscreen,
      props.showToolbarName,
      setModalData,
      ult.toolbarTips,
      updateSetting
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
    </>
  );
};

export default React.memo(Toolbar);
