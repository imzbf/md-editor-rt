import { memo } from 'react';
import ClipModal from './Clip';

interface ModalsProps {
  clipVisible: boolean;
  onCancel: () => void;
  onOk: (data?: any) => void;
}

const Modals = (props: ModalsProps) => {
  return (
    <ClipModal visible={props.clipVisible} onOk={props.onOk} onCancel={props.onCancel} />
  );
};

// 链接弹窗\图片弹窗\帮助弹窗
export default memo(Modals);
