import React, { useRef, useState, ReactElement, useLayoutEffect } from 'react';
import cn from 'classnames';
import { prefix } from '../../config';
import { keyMove } from '../../utils/dom';
import './style.less';

export type ModalProps = Readonly<{
  title?: string | ReactElement;
  visible?: boolean;
  width?: number;
  onClosed?: () => void;
  children?: any;
}>;

export default (props: ModalProps) => {
  const { onClosed = () => {} } = props;

  const modalClass = useRef([`${prefix}-modal`]);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalHeaderRef = useRef<HTMLDivElement>(null);

  const [initPos, setInitPos] = useState({
    left: '0px',
    top: '0px'
  });

  const [inited, setInited] = useState(false);

  useLayoutEffect(() => {
    let keyMoveClear = () => {};

    if (inited) {
      setTimeout(() => {
        keyMoveClear = keyMove(
          modalHeaderRef.current as HTMLElement
          // (left: number, top: number) => {
          //   setInitPos({
          //     left: left + 'px',
          //     top: top + 'px'
          //   });
          // }
        );
      });
    }

    return keyMoveClear;
  }, [inited]);

  useLayoutEffect(() => {
    const nVal = props.visible;

    if (nVal) {
      modalClass.current.push('zoom-in');

      setTimeout(() => {
        const halfWidth = (modalRef.current as HTMLElement).offsetWidth / 2;
        const halfHeight = (modalRef.current as HTMLElement).offsetHeight / 2;

        const halfClientWidth = document.documentElement.clientWidth / 2;
        const halfClientHeight = document.documentElement.clientHeight / 2;

        setInitPos({
          left: halfClientWidth - halfWidth + 'px',
          top: halfClientHeight - halfHeight + 'px'
        });
      }, 0);
      setTimeout(() => {
        modalClass.current = modalClass.current.filter((item) => item !== 'zoom-in');
      }, 140);

      !inited && setInited(true);
    } else {
      modalClass.current.push('zoom-out');
      setTimeout(() => {
        modalClass.current = modalClass.current.filter((item) => item !== 'zoom-out');
      }, 130);
    }
  }, [props.visible]);

  return (
    <div style={{ display: props.visible && inited ? 'block' : 'none' }}>
      <div className={`${prefix}-modal-mask`} onClick={onClosed} />
      <div
        className={cn(modalClass.current)}
        style={{
          left: initPos.left,
          top: initPos.top,
          width: typeof props.width === 'number' ? `${props.width}px` : props.width
        }}
        ref={modalRef}
      >
        <div className={`${prefix}-modal-header`} ref={modalHeaderRef}>
          <div className={`${prefix}-modal-title`}>{props.title || ''}</div>
          <div
            className={`${prefix}-modal-close`}
            onClick={(e) => {
              e.stopPropagation();
              props.onClosed && props.onClosed();
            }}
          >
            <svg className={`${prefix}-icon`} aria-hidden="true">
              <use xlinkHref="#icon-close" />
            </svg>
          </div>
        </div>
        <div className={`${prefix}-modal-body`}>{props.children}</div>
      </div>
    </div>
  );
};
