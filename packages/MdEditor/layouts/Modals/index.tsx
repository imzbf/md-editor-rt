import React from 'react';
import LinkModal from './Link';
import ClipModal from './Clip';

interface ModalsProps {
  type: 'link' | 'image';
  linkVisible: boolean;
  clipVisible: boolean;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

const Modals = (props: ModalsProps) => {
  return (
    <>
      <LinkModal
        type={props.type}
        visible={props.linkVisible}
        onOk={props.onOk}
        onCancel={props.onCancel}
      />
      <ClipModal
        visible={props.clipVisible}
        onOk={props.onOk}
        onCancel={props.onCancel}
      />
    </>
  );
};

// 链接弹窗\图片弹窗\帮助弹窗
export default Modals;
