import React, {
  ReactElement,
  cloneElement,
  CSSProperties,
  useEffect,
  useRef,
  useState,
  JSXElementConstructor
} from 'react';

import './style.less';

interface CtlTypes {
  overlayClass: string;
  overlayStyle: CSSProperties;
  // triggerHover: boolean;
  // overlayHover: boolean;
}

interface ModalProp {
  trigger?: 'hover' | 'click';
  overlay: string | number | ReactElement;
  visible: boolean;
  children?: string | number | ReactElement;
  onChange: (v: boolean) => void;
}

import { prefix } from '../../config';
const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;

const DropDown = (props: ModalProp) => {
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

  const triggerHandler = () => {
    if (props.trigger === 'hover') {
      status.current.triggerHover = true;
    }

    const triggerEle = triggerRef.current as HTMLElement;
    const overlayEle = overlayRef.current as HTMLElement;

    const triggerInfo = triggerEle.getBoundingClientRect();

    const triggerTop = triggerEle.offsetTop;
    const triggerLeft = triggerEle.offsetLeft;
    const triggerHeight = triggerInfo.height;
    const triggerWidth = triggerInfo.width;

    // 设置好正对位置
    setCtl((_ctl) => ({
      ..._ctl,
      overlayStyle: {
        top: triggerTop + triggerHeight + 'px',
        left: triggerLeft - overlayEle.offsetWidth / 2 + triggerWidth / 2 + 'px'
      }
    }));

    props.onChange(true);
  };

  const overlayHandler = () => {
    status.current.overlayHover = true;
  };

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

  // 点击非内容区域时触发关闭
  const clickHidden = (e: MouseEvent) => {
    const triggerEle = triggerRef.current as HTMLElement;
    const overlayEle = overlayRef.current as HTMLElement;

    if (
      !triggerEle.contains(e.target as HTMLElement) &&
      !overlayEle.contains(e.target as HTMLElement)
    ) {
      props.onChange(false);
    }
  };

  const hiddenTimer = useRef(-1);
  const leaveHidden = (e: MouseEvent) => {
    if (triggerRef.current === e.target) {
      status.current.triggerHover = false;
    } else {
      status.current.overlayHover = false;
    }

    clearTimeout(hiddenTimer.current);
    hiddenTimer.current = window.setTimeout(() => {
      if (!status.current.overlayHover && !status.current.triggerHover) {
        props.onChange(false);
      }
    }, 10);
  };

  useEffect(() => {
    if (props.trigger === 'click') {
      (triggerRef.current as HTMLElement).addEventListener('click', triggerHandler);
      document.addEventListener('click', clickHidden);
    } else {
      (triggerRef.current as HTMLElement).addEventListener('mouseenter', triggerHandler);
      (triggerRef.current as HTMLElement).addEventListener('mouseleave', leaveHidden);

      (overlayRef.current as HTMLElement).addEventListener('mouseenter', overlayHandler);
      (overlayRef.current as HTMLElement).addEventListener('mouseleave', leaveHidden);
    }

    // 卸载组件时清除事件监听
    return () => {
      if (props.trigger === 'click' && triggerRef.current) {
        (triggerRef.current as HTMLElement).removeEventListener('click', triggerHandler);
        document.removeEventListener('click', clickHidden);
      } else {
        if (triggerRef.current) {
          (triggerRef.current as HTMLElement).removeEventListener(
            'mouseenter',
            triggerHandler
          );
          (triggerRef.current as HTMLElement).removeEventListener(
            'mouseleave',
            leaveHidden
          );
        }

        if (overlayRef.current) {
          // 同时移除内容区域监听
          (overlayRef.current as HTMLElement).removeEventListener(
            'mouseenter',
            overlayHandler
          );
          (overlayRef.current as HTMLElement).removeEventListener(
            'mouseleave',
            leaveHidden
          );
        }
      }
    };
  }, []);

  const slotDefault = props.children as ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;
  const slotOverlay = props.overlay as ReactElement<
    any,
    string | JSXElementConstructor<any>
  >;

  // 触发器
  const trigger = cloneElement(slotDefault, {
    ref: triggerRef
  });

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

DropDown.defaultProps = {
  trigger: 'hover'
};

export default DropDown;
