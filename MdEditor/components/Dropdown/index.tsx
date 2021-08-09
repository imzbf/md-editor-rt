import React, {
  ReactElement,
  cloneElement,
  CSSProperties,
  useEffect,
  useRef,
  useState
} from 'react';

import cn from 'classnames';

import './style.less';

interface CtlTypes {
  overlayClass: string;
  overlayStyle: CSSProperties;
}

interface ModalProp {
  trigger: 'hover' | 'click';
  overlay: string | number | ReactElement;
  visible: boolean;
  to: HTMLElement;
  children?: string | number | ReactElement;
  onChange: (v: boolean) => void;
}

import { prefix } from '../../config';
import { createPortal } from 'react-dom';

const DropDown = (props: ModalProp) => {
  const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;

  const [ctl, setCtl] = useState<CtlTypes>({
    overlayClass: '',
    overlayStyle: {}
  });

  const triggerRef = useRef<HTMLElement>(document.body);
  const overlayRef = useRef<HTMLElement>(document.body);

  const triggerHandler = (e: MouseEvent, type: 'click' | 'hover' = 'click') => {
    if (type === 'click') {
      const triggerEle: HTMLElement = triggerRef.current;
      const overlayEle: HTMLElement = overlayRef.current;

      const triggerInfo = triggerEle.getBoundingClientRect();

      const triggerTop = triggerEle.offsetTop;
      const triggerLeft = triggerEle.offsetLeft;
      const triggerHeight = triggerInfo.height;
      const triggerWidth = triggerInfo.width;

      // 设置好正对位置
      setCtl((ctlN) => {
        return {
          ...ctlN,
          overlayStyle: {
            ...ctlN.overlayStyle,
            top: triggerTop + triggerHeight + 'px',
            left: triggerLeft - overlayEle.offsetWidth / 2 + triggerWidth / 2 + 'px',
            marginTop: '10px'
          }
        };
      });

      props.onChange(!props.visible);
    } else {
      props.onChange(true);
    }
  };

  // 显示状态变化后修改某些属性
  useEffect(() => {
    setCtl((ctlN) => {
      return {
        ...ctlN,
        overlayClass: cn(`${prefix}-dropdown-overlay`, !props.visible && HIDDEN_CLASS)
      };
    });
  }, [props.visible]);

  // 点击非内容区域时触发关闭
  const hiddenHandler = (e: MouseEvent) => {
    const triggerEle: HTMLElement = triggerRef.current;
    const overlayEle: HTMLElement = overlayRef.current;

    if (
      !triggerEle.contains(e.target as HTMLElement) &&
      !overlayEle.contains(e.target as HTMLElement)
    ) {
      props.onChange(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', hiddenHandler);

    // 卸载组件时清除副作用
    return () => {
      document.removeEventListener('click', hiddenHandler);
    };
  }, []);

  const slotDefault = props.children;
  const slotOverlay = props.overlay;

  // 触发器
  const trigger = cloneElement(
    slotDefault instanceof Array ? slotDefault[0] : slotDefault,
    {
      onClick: triggerHandler,
      // onMouseover: (e: MouseEvent) => triggerHandler(e, 'hover'),
      // onMouseleave: (e: MouseEvent) => {
      //   ctl.visible = false;
      // },
      ref: triggerRef
    }
  );
  // 列表内容
  const overlay = cloneElement(
    slotOverlay instanceof Array ? slotOverlay[0] : slotOverlay,
    { className: ctl.overlayClass, style: ctl.overlayStyle, ref: overlayRef }
  );

  return (
    <>
      {trigger}
      {createPortal(overlay, props.to)}
    </>
  );
};

export default DropDown;
