import React, { useEffect, useState } from 'react';
import LinkModal from './Link';
import ClipModal from './Clip';
import { StaticTextDefaultValue } from '../../Editor';

interface ModalsProp {
  type: 'link' | 'image' | 'help';
  visible: boolean;
  ult: StaticTextDefaultValue;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

const Modals = (props: ModalsProp) => {
  const [modelVisible, setModelVisible] = useState({
    link: false,
    clip: false
  });

  // 跟随外层状态
  useEffect(() => {
    setModelVisible({
      link: props.visible,
      // 关闭时同步关闭裁剪弹窗
      clip: props.visible ? modelVisible.clip : props.visible
    });
  }, [props.visible]);
  return (
    <>
      <LinkModal
        {...props}
        visible={modelVisible.link}
        onClip={() => {
          setModelVisible({
            // 关闭链接弹窗
            link: false,
            // 打开裁剪上传弹窗
            clip: true
          });
        }}
      />
      <ClipModal
        ult={props.ult}
        visible={modelVisible.clip}
        onOk={props.onOk}
        onCancel={props.onCancel}
      />
    </>
  );
};

// 链接弹窗\图片弹窗\帮助弹窗
export default Modals;
