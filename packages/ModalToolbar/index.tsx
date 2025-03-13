import { CSSProperties, ReactNode, useMemo, MouseEvent } from 'react';
import { prefix } from '~/config';
import Modal from '~/components/Modal';

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

  return (
    <>
      <div
        className={className}
        title={props.title}
        onClick={(e) => {
          if (props.disabled) return;
          props.onClick(e);
        }}
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
