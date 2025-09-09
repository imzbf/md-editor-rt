import {
  ReactElement,
  cloneElement,
  CSSProperties,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode
} from 'react';

import { prefix } from '~/config';

interface CtlTypes {
  overlayClass: string;
  overlayStyle: CSSProperties;
  // triggerHover: boolean;
  // overlayHover: boolean;
}

interface ModalProps {
  overlay: ReactNode;
  visible: boolean;
  children: ReactElement;
  onChange: (v: boolean) => void;
  relative?: string;
  disabled?: boolean;
}

const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;

const DropDown = (props: ModalProps) => {
  const { relative = 'html', onChange, disabled } = props;
  const [ctl, setCtl] = useState<CtlTypes>({
    overlayClass: HIDDEN_CLASS,
    overlayStyle: {}
  });

  const status = useRef({
    triggerHover: false,
    overlayHover: false
  });

  const triggerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const triggerHandler = useCallback(() => {
    if (disabled) {
      return false;
    }

    status.current.triggerHover = true;

    const triggerEle = triggerRef.current as HTMLElement;
    const overlayEle = overlayRef.current as HTMLElement;

    // 尝试移除元素不存在的潜在问题（https://github.com/imzbf/md-editor-v3/issues/308）
    if (!triggerEle || !overlayEle) {
      return;
    }

    const triggerInfo = triggerEle.getBoundingClientRect();

    const triggerTop = triggerEle.offsetTop;
    const triggerLeft = triggerEle.offsetLeft;
    const triggerHeight = triggerInfo.height;
    const triggerWidth = triggerInfo.width;

    const rootNode = triggerEle.getRootNode() as Document | ShadowRoot;
    const relativecrollLeft = rootNode.querySelector(relative)?.scrollLeft || 0;
    const relativeWidth = rootNode.querySelector(relative)?.clientWidth || 0;

    let left =
      triggerLeft - overlayEle.offsetWidth / 2 + triggerWidth / 2 - relativecrollLeft;

    // 下拉框的右侧超出了相对元素的右侧，则设定不能超过
    if (left + overlayEle.offsetWidth > relativecrollLeft + relativeWidth) {
      left = relativecrollLeft + relativeWidth - overlayEle.offsetWidth;
    }

    if (left < 0) {
      left = 0;
    }

    // 设置好正对位置
    setCtl((_ctl) => ({
      ..._ctl,
      overlayStyle: {
        top: triggerTop + triggerHeight + 'px',
        left: left + 'px'
      }
    }));

    onChange(true);
  }, [disabled, onChange, relative]);

  const overlayHandler = useCallback(() => {
    if (disabled) {
      return false;
    }
    status.current.overlayHover = true;
  }, [disabled]);

  const hiddenTimer = useRef(-1);
  const leaveHidden = useCallback(
    (e: MouseEvent) => {
      if (disabled) {
        return false;
      }

      if (triggerRef.current?.contains(e.target as Node)) {
        status.current.triggerHover = false;
      } else {
        status.current.overlayHover = false;
      }

      clearTimeout(hiddenTimer.current);
      hiddenTimer.current = window.setTimeout(() => {
        if (!status.current.overlayHover && !status.current.triggerHover) {
          onChange(false);
        }
      }, 10);
    },
    [disabled, onChange]
  );

  const slotDefault = props.children;
  const slotOverlay = props.overlay;

  // 触发器
  const trigger = cloneElement<any>(slotDefault, {
    ref: triggerRef,
    key: 'cloned-dropdown-trigger'
  });

  // 显示状态变化后修改某些属性
  useEffect(() => {
    if (props.visible) {
      setCtl((ctlN) => {
        return {
          ...ctlN,
          overlayClass: ''
        };
      });
    } else {
      setCtl((ctlN) => {
        return {
          ...ctlN,
          overlayClass: HIDDEN_CLASS
        };
      });
    }
  }, [props.visible]);

  useEffect(() => {
    const _trigger = triggerRef.current;
    const _overlay = overlayRef.current;
    _trigger?.addEventListener('mouseenter', triggerHandler);
    _trigger?.addEventListener('mouseleave', leaveHidden);

    _overlay?.addEventListener('mouseenter', overlayHandler);
    _overlay?.addEventListener('mouseleave', leaveHidden);

    // 卸载组件时清除事件监听
    return () => {
      _trigger?.removeEventListener('mouseenter', triggerHandler);
      _trigger?.removeEventListener('mouseleave', leaveHidden);

      // 同时移除内容区域监听
      _overlay?.removeEventListener('mouseenter', overlayHandler);
      _overlay?.removeEventListener('mouseleave', leaveHidden);
    };
  }, [leaveHidden, overlayHandler, triggerHandler]);

  // 列表内容
  const overlay = (
    <div
      className={`${prefix}-dropdown ${ctl.overlayClass}`}
      style={ctl.overlayStyle}
      ref={overlayRef}
    >
      <div className={`${prefix}-dropdown-overlay`}>
        {slotOverlay instanceof Array ? slotOverlay[0] : slotOverlay}
      </div>
    </div>
  );

  return (
    <>
      {trigger}
      {overlay}
    </>
  );
};

export default DropDown;
