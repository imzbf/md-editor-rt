import React, { useRef, useState, ReactElement, useEffect, useMemo } from 'react';
import { prefix } from '~/config';
import { keyMove } from '~/utils/dom';

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
}>;

const Modal = (props: ModalProps) => {
  const { onClose = () => {} } = props;
  const [modalVisible, setMV] = useState(props.visible);
  const [modalClass, setModalClass] = useState([`${prefix}-modal`]);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalHeaderRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState({
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

  const [inited, setInited] = useState(false);

  useEffect(() => {
    let keyMoveClear = () => {};

    if (!props.isFullscreen) {
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
  }, [inited, props.isFullscreen]);

  useEffect(() => {
    if (modalVisible) {
      const halfWidth = (modalRef.current as HTMLElement).offsetWidth / 2;
      const halfHeight = (modalRef.current as HTMLElement).offsetHeight / 2;
      const halfClientWidth = document.documentElement.clientWidth / 2;
      const halfClientHeight = document.documentElement.clientHeight / 2;

      setState((_state) => {
        return {
          ..._state,
          initPos: {
            left: halfClientWidth - halfWidth + 'px',
            top: halfClientHeight - halfHeight + 'px'
          }
        };
      });

      !inited && setInited(true);
    }
  }, [inited, modalVisible]);

  useEffect(() => {
    const nVal = props.visible;

    if (nVal) {
      setModalClass(() => [`${prefix}-modal`, 'zoom-in']);
      setMV(nVal);
    } else if (inited) {
      setModalClass(() => [`${prefix}-modal`, 'zoom-out']);

      setTimeout(() => {
        setMV(nVal);
      }, 150);
    }
  }, [inited, props.visible]);

  return (
    <div className={props.className} style={{ display: modalVisible ? 'block' : 'none' }}>
      <div className={`${prefix}-modal-mask`} onClick={onClose} />
      <div
        className={modalClass.join(' ')}
        style={{
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

                props.onAdjust instanceof Function && props.onAdjust(!props.isFullscreen);
              }}
            >
              <svg className={`${prefix}-icon`} aria-hidden="true">
                <use
                  xlinkHref={`#md-editor-icon-${
                    props.isFullscreen ? 'suoxiao' : 'fangda'
                  }`}
                />
              </svg>
            </div>
          )}
          <div
            className={`${prefix}-modal-close`}
            onClick={(e) => {
              e.stopPropagation();
              props.onClose && props.onClose();
            }}
          >
            <svg className={`${prefix}-icon`} aria-hidden="true">
              <use xlinkHref="#md-editor-icon-close" />
            </svg>
          </div>
        </div>
        <div className={`${prefix}-modal-body`}>{props.children}</div>
      </div>
    </div>
  );
};

Modal.defaultProps = {
  onAdjust() {}
} as ModalProps;

export default Modal;
