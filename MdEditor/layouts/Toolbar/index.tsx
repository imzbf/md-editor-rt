import React, { useEffect, useRef, useState } from 'react';
import screenfull from 'screenfull';
import { StaticTextDefaultValue, ToolbarNames, SettingType } from '../../Editor';
import { goto, ToolDirective } from '../../utils';
import { prefix } from '../../config';
import bus from '../../utils/event-bus';
import Divider from '../../components/Divider';
import Dropdown from '../../components/Dropdown';

export interface ToolbarProp {
  editorId: string;
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
  setting: SettingType;
  // 使用的语言设置
  ult: StaticTextDefaultValue;
  updateSetting: (v: boolean, k: keyof SettingType) => void;
}

const Toolbar = ({
  editorId,
  toolbars,
  toolbarsExclude,
  setting,
  ult,
  updateSetting
}: ToolbarProp) => {
  const [visible, setVisible] = useState({
    title: false,
    catalog: false
  });

  const emitHandler = (direct: ToolDirective, params?: any) => {
    bus.emit('replace', direct, params);
  };

  const fullScreen = () => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    } else {
      console.error('浏览器不支持全屏');
    }
  };

  if (screenfull.isEnabled) {
    screenfull.on('change', () => {
      updateSetting(!setting.fullscreen, 'fullscreen');
    });
  }

  const showBar = (name: ToolbarNames) =>
    toolbars.includes(name) && !toolbarsExclude.includes(name);

  // 链接
  const [modalData, setModalData] = useState<{
    type: 'link' | 'image' | 'help';
    visible: boolean;
  }>({
    type: 'link',
    visible: false
  });

  // 挂载位置
  const to = useRef(document.body);
  useEffect(() => {
    to.current = document.getElementById(editorId) as HTMLElement;
  }, []);

  return (
    <div className={`${prefix}-toolbar-wrapper`}>
      <div className={`${prefix}-toolbar`}>
        <div className={`${prefix}-toolbar-left`}>
          {showBar('bold') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.bold}
              onClick={() => {
                emitHandler('bold');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-bold" />
              </svg>
            </div>
          )}
          {showBar('underline') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.underline}
              onClick={() => {
                emitHandler('underline');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-underline" />
              </svg>
            </div>
          )}
          {showBar('italic') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.italic}
              onClick={() => {
                emitHandler('italic');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-italic" />
              </svg>
            </div>
          )}
          {showBar('strikeThrough') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.strikeThrough}
              onClick={() => {
                emitHandler('strikeThrough');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-strike-through" />
              </svg>
            </div>
          )}
          <Divider />
          {showBar('title') && (
            <Dropdown
              visible={visible.title}
              trigger="click"
              onChange={(v) => {
                console.log('visible.title', v);
                setVisible((vi) => ({
                  ...vi,
                  title: v
                }));
              }}
              to={to.current}
              overlay={
                <ul
                  className={`${prefix}-menu`}
                  onClick={() => {
                    visible.title = false;
                  }}
                >
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
            >
              <div className={`${prefix}-toolbar-item`} title={ult.toolbarTips?.title}>
                <svg className={`${prefix}-icon`} aria-hidden="true">
                  <use xlinkHref="#icon-title" />
                </svg>
              </div>
            </Dropdown>
          )}
          {showBar('sub') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.sub}
              onClick={() => {
                emitHandler('sub');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-sub" />
              </svg>
            </div>
          )}
          {showBar('sup') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.sup}
              onClick={() => {
                emitHandler('sup');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-sup" />
              </svg>
            </div>
          )}
          {showBar('quote') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.quote}
              onClick={() => {
                emitHandler('quote');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-quote" />
              </svg>
            </div>
          )}
          {showBar('unorderedList') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.unorderedList}
              onClick={() => {
                emitHandler('unorderedList');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-unordered-list" />
              </svg>
            </div>
          )}
          {showBar('orderedList') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.orderedList}
              onClick={() => {
                emitHandler('orderedList');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-ordered-list" />
              </svg>
            </div>
          )}
          <Divider />
          {showBar('codeRow') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.codeRow}
              onClick={() => {
                emitHandler('codeRow');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-code-row" />
              </svg>
            </div>
          )}
          {showBar('code') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.code}
              onClick={() => {
                emitHandler('code');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-code" />
              </svg>
            </div>
          )}
          {showBar('link') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.link}
              onClick={() => {
                setModalData({
                  type: 'link',
                  visible: true
                });
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-link" />
              </svg>
            </div>
          )}
          {showBar('image') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.image}
              onClick={() => {
                setModalData({
                  type: 'image',
                  visible: true
                });
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-image" />
              </svg>
            </div>
          )}
          {showBar('table') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.table}
              onClick={() => {
                emitHandler('table');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-table" />
              </svg>
            </div>
          )}
          <Divider />
          {showBar('revoke') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.revoke}
              onClick={() => {
                bus.emit('ctrlZ');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-revoke" />
              </svg>
            </div>
          )}
          {showBar('next') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.next}
              onClick={() => {
                bus.emit('ctrlShiftZ');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-next" />
              </svg>
            </div>
          )}
          {showBar('save') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.save}
              onClick={() => {
                bus.emit('onSave');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-baocun" />
              </svg>
            </div>
          )}
        </div>
        <div className={`${prefix}-toolbar-right`}>
          {showBar('prettier') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.prettier}
              onClick={() => {
                emitHandler('prettier');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-prettier" />
              </svg>
            </div>
          )}

          {showBar('pageFullscreen') && !setting.fullscreen && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.pageFullscreen}
              onClick={() => {
                updateSetting(!setting.pageFullScreen, 'pageFullScreen');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use
                  xlinkHref={`#icon-${setting.pageFullScreen ? 'suoxiao' : 'fangda'}`}
                />
              </svg>
            </div>
          )}

          {showBar('fullscreen') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.fullscreen}
              onClick={fullScreen}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use
                  xlinkHref={`#icon-${
                    setting.fullscreen ? 'fullScreen-exit' : 'fullScreen'
                  }`}
                />
              </svg>
            </div>
          )}

          {showBar('preview') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.preview}
              onClick={() => {
                updateSetting(!setting.preview, 'preview');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-preview" />
              </svg>
            </div>
          )}
          {/* 
    <Dropdown
      visible={visible.catalog}
      onChange={(v) => {
        visible.catalog = v;
      }}
      overlay={<div>123</div>}
      to={to.value}
    >
      <div className={`${prefix}-toolbar-item`} title="目录">
        <svg className={`${prefix}-icon`} aria-hidden="true">
          <use xlinkHref="#icon-catalog" />
        </svg>
      </div>
    </Dropdown> */}

          {showBar('htmlPreview') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.htmlPreview}
              onClick={() => {
                updateSetting(!setting.htmlPreview, 'htmlPreview');
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-coding" />
              </svg>
            </div>
          )}

          {showBar('github') && (
            <div
              className={`${prefix}-toolbar-item`}
              title={ult.toolbarTips?.github}
              onClick={() => goto('https://github.com/imzbf/md-editor-v3')}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use xlinkHref="#icon-github" />
              </svg>
            </div>
          )}
        </div>
      </div>
      {/* <Modals
        visible={modalData.visible}
        type={modalData.type}
        onCancel={() => {
          modalData.visible = false;
        }}
        onOk={(data) => {
          if (data) {
            emitHandler(modalData.type, {
              desc: data.desc,
              url: data.url
            });
          }
          modalData.visible = false;
        }}
        to={to.current}
      /> */}
    </div>
  );
};

export default Toolbar;
