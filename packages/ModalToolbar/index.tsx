import { CSSProperties, ReactNode, useMemo, MouseEvent, useCallback } from 'react';
import Modal from '~/components/Modal';
import { prefix } from '~/config';

export interface ModalToolbarProps {
  title?: string;
  modalTitle?: string;
  visible: boolean;
  width?: string;
  height?: string;
  trigger: ReactNode;
  onClick: (e: MouseEvent) => void;
  onClose: () => void;
  showAdjust?: boolean;
  isFullscreen?: boolean;
  onAdjust?: (v: boolean) => void;
  children?: any;
  className?: string;
  style?: CSSProperties;
  showMask?: boolean;
  disabled?: boolean;
}

const ModalToolbar = (props: ModalToolbarProps) => {
  const { width = 'auto', height = 'auto' } = props;

  const className = useMemo(() => {
    return `${prefix}-toolbar-item${props.disabled ? ' ' + prefix + '-disabled' : ''}`;
  }, [props.disabled]);

  const onAdjust = useCallback(
    (v: boolean) => {
      if (props.onAdjust instanceof Function) {
        props.onAdjust(v);
      }
    },
    [props]
  );

  return (
    <>
      <button
        className={className}
        title={props.title}
        onClick={(e) => {
          props.onClick(e);
        }}
        disabled={props.disabled}
      >
        {props.trigger}
      </button>
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
        onAdjust={onAdjust}
      >
        {props.children}
      </Modal>
    </>
  );
};

export default ModalToolbar;
