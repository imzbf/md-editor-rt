import React, { ReactElement } from 'react';
import { prefix } from '../config';
import Modal from '../components/Modal';

export interface ModalToolbarProp {
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
}

const ModalToolbar = (props: ModalToolbarProp) => {
  const { width = 'auto', height = 'auto' } = props;
  return (
    <>
      <div
        className={`${prefix}-toolbar-item`}
        title={props.title}
        onClick={() => {
          if (props.onClick instanceof Function) {
            props.onClick();
          }
        }}
      >
        {props.trigger}
      </div>
      <Modal
        width={width}
        height={height}
        title={props.modalTitle}
        visible={props.visible}
        onClose={() => {
          if (props.onClose instanceof Function) {
            props.onClose();
          }
        }}
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
