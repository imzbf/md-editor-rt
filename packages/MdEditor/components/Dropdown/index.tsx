/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  ReactElement,
  cloneElement,
  CSSProperties,
  useEffect,
  useRef,
  useState,
  JSXElementConstructor,
  useCallback
} from 'react';

import { prefix } from '~/config';

interface CtlTypes {
  overlayClass: string;
  overlayStyle: CSSProperties;
  // triggerHover: boolean;
  // overlayHover: boolean;
}

interface ModalProps {
  overlay: string | number | ReactElement;
  visible: boolean;
  children?: string | number | ReactElement;
  onChange: (v: boolean) => void;
  relative?: string;
}

const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;

const DropDown = (props: ModalProps) => {
  const { relative = 'html' } = props;
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

    const relativecrollLeft = document.querySelector(relative)?.scrollLeft || 0;
    const relativeWidth = document.querySelector(relative)?.clientWidth || 0;

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

    props.onChange(true);
  }, [props, relative]);

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

  const hiddenTimer = useRef(-1);
  const leaveHidden = useCallback(
    (e: MouseEvent) => {
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
    },
    [props]
  );

  useEffect(() => {
    triggerRef.current?.addEventListener('mouseenter', triggerHandler);
    triggerRef.current?.addEventListener('mouseleave', leaveHidden);

    overlayRef.current?.addEventListener('mouseenter', overlayHandler);
    overlayRef.current?.addEventListener('mouseleave', leaveHidden);

    // 卸载组件时清除事件监听
    return () => {
      triggerRef.current?.removeEventListener('mouseenter', triggerHandler);
      triggerRef.current?.removeEventListener('mouseleave', leaveHidden);

      // 同时移除内容区域监听
      overlayRef.current?.removeEventListener('mouseenter', overlayHandler);
      overlayRef.current?.removeEventListener('mouseleave', leaveHidden);
    };
  }, [leaveHidden, triggerHandler]);

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
    ref: triggerRef,
    key: 'cloned-dropdown-trigger'
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

export default DropDown;
