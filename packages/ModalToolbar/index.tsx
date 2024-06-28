import React, { CSSProperties, ReactElement } from 'react';
import { prefix } from '~/config';
import Modal from '~/components/Modal';

export interface ModalToolbarProps {
  title?: string;
  modalTitle?: string;
  visible: boolean;
  width?: string;
  height?: string;
  trigger: string | ReactElement;
  onClick: () => void;
  onClose: () => void;
  showAdjust?: boolean;
  isFullscreen?: boolean;
  onAdjust?: (v: boolean) => void;
  children?: any;
  className?: string;
  style?: CSSProperties;
  showMask?: boolean;
}

const ModalToolbar = (props: ModalToolbarProps) => {
  const { width = 'auto', height = 'auto' } = props;
  return (
    <>
      <div
        className={`${prefix}-toolbar-item`}
        title={props.title}
        onClick={props.onClick}
      >
        {props.trigger}
      </div>
      <Modal
        className={props.className}
        style={props.style}
        width={width}
        height={height}
        title={props.modalTitle}
        visible={props.visible}
        showMask={props.showMask}
        onClose={props.onClose}
        showAdjust={props.showAdjust}
        isFullscreen={props.isFullscreen}
        onAdjust={(v) => {
          if (props.onAdjust instanceof Function) {
            props.onAdjust(v);
          }
        }}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default ModalToolbar;
