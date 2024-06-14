import React, {
  CSSProperties,
  useRef,
  useState,
  ReactElement,
  useEffect,
  useMemo,
  useContext
} from 'react';
import { createPortal } from 'react-dom';
import { configOption, prefix } from '~/config';
import { keyMove } from '~/utils/dom';
import { EditorContext } from '~/Editor';
import { getZIndexIncrement } from '~/utils';
import Icon from '../Icon';

export type ModalProps = Readonly<{
  title?: string | ReactElement;
  visible?: boolean;
  width?: string;
  height?: string;
  onClose?: () => void;
  showAdjust?: boolean;
  isFullscreen?: boolean;
  onAdjust?: (val: boolean) => void;
  children?: any;
  className?: string;
  // style只能是对象，搞不了字符串
  style?: CSSProperties;
  showMask?: boolean;
}>;

const toClass = `${prefix}-modal-container`;

const Modal = (props: ModalProps) => {
  const { theme } = useContext(EditorContext);

  const { onClose = () => {}, onAdjust = () => {}, style = {}, showMask = true } = props;
  const [modalVisible, setMV] = useState(props.visible);
  const [modalClass, setModalClass] = useState([`${prefix}-modal`]);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalHeaderRef = useRef<HTMLDivElement>(null);

  const bodyRef = useRef<HTMLElement>();

  // 创建的弹窗容器，存放在document.body末尾
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<{
    maskStyle: CSSProperties;
    modalStyle: CSSProperties;
    initPos: CSSProperties;
    historyPos: CSSProperties;
  }>({
    maskStyle: {
      zIndex: -1
    },
    modalStyle: {
      zIndex: -1
    },
    initPos: {
      left: '0px',
      top: '0px'
    },
    historyPos: {
      left: '0px',
      top: '0px'
    }
  });

  const innerSize = useMemo(() => {
    if (props.isFullscreen) {
      return {
        width: '100%',
        height: '100%'
      };
    } else {
      return {
        width: props.width,
        height: props.height
      };
    }
  }, [props.height, props.isFullscreen, props.width]);

  useEffect(() => {
    bodyRef.current = document.body;
    return () => {
      bodyRef.current = undefined;
    };
  }, []);

  useEffect(() => {
    let keyMoveClear = () => {};

    if (!props.isFullscreen && props.visible) {
      keyMoveClear = keyMove(
        modalHeaderRef.current as HTMLDivElement,
        (left: number, top: number) => {
          setState((_state) => {
            return {
              ..._state,
              initPos: {
                left: left + 'px',
                top: top + 'px'
              }
            };
          });
        }
      );
    }

    return keyMoveClear;
  }, [props.isFullscreen, props.visible]);

  useEffect(() => {
    if (modalVisible) {
      const halfWidth = (modalRef.current as HTMLElement).offsetWidth / 2;
      const halfHeight = (modalRef.current as HTMLElement).offsetHeight / 2;
      const halfClientWidth = document.documentElement.clientWidth / 2;
      const halfClientHeight = document.documentElement.clientHeight / 2;

      setState((_state) => {
        return {
          ..._state,
          maskStyle: {
            zIndex: configOption.editorConfig.zIndex! + getZIndexIncrement()
          },
          modalStyle: {
            zIndex: configOption.editorConfig.zIndex! + getZIndexIncrement()
          },
          initPos: {
            left: halfClientWidth - halfWidth + 'px',
            top: halfClientHeight - halfHeight + 'px'
          }
        };
      });
    }
  }, [modalVisible]);

  useEffect(() => {
    const nVal = props.visible;

    if (nVal) {
      setModalClass(() => [`${prefix}-modal`, 'zoom-in']);
      setMV(nVal);
    } else {
      setModalClass(() => [`${prefix}-modal`, 'zoom-out']);

      setTimeout(() => {
        setMV(nVal);
      }, 150);
    }
  }, [props.visible]);

  return (
    <>
      {bodyRef.current &&
        createPortal(
          <div ref={containerRef} className={toClass} data-theme={theme}>
            <div
              className={props.className}
              style={{ ...style, display: modalVisible ? 'block' : 'none' }}
            >
              {showMask && (
                <div
                  className={`${prefix}-modal-mask`}
                  style={state.maskStyle}
                  onClick={onClose}
                />
              )}
              <div
                className={modalClass.join(' ')}
                style={{
                  ...state.modalStyle,
                  ...state.initPos,
                  ...innerSize
                }}
                ref={modalRef}
              >
                <div className={`${prefix}-modal-header`} ref={modalHeaderRef}>
                  {props.title || ''}
                </div>
                <div className={`${prefix}-modal-func`}>
                  {props.showAdjust && (
                    <div
                      className={`${prefix}-modal-adjust`}
                      onClick={(e) => {
                        e.stopPropagation();

                        // 全屏时，保存上次位置
                        if (!props.isFullscreen) {
                          setState((_state) => ({
                            ..._state,
                            historyPos: _state.initPos,
                            initPos: {
                              left: '0',
                              top: '0'
                            }
                          }));
                        } else {
                          setState((_state) => ({
                            ..._state,
                            initPos: _state.historyPos
                          }));
                        }

                        onAdjust instanceof Function && onAdjust(!props.isFullscreen);
                      }}
                    >
                      <Icon name={props.isFullscreen ? 'suoxiao' : 'fangda'} />
                    </div>
                  )}
                  <div
                    className={`${prefix}-modal-close`}
                    onClick={(e) => {
                      e.stopPropagation();
                      props.onClose && props.onClose();
                    }}
                  >
                    <Icon name="close" />
                  </div>
                </div>
                <div className={`${prefix}-modal-body`}>{props.children}</div>
              </div>
            </div>
          </div>,
          bodyRef.current
        )}
    </>
  );
};

export default Modal;
