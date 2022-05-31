/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { cloneElement, CSSProperties, useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Menu from './Menu';
import MenuItem from './MenuItem';
import { debounce, getOffset, classnames } from '@/utils';
import './index.less';

interface IzDropdownProp {
  children: JSX.Element;
  content: JSX.Element;
}

const IzDropdown = (props: IzDropdownProp) => {
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<{
    inited: boolean;
    visible: boolean;
    style: CSSProperties;
    class: string;
  }>({
    inited: false,
    visible: false,
    style: {
      top: 0,
      left: 0
    },
    class: 'dropdown-content animated'
  });

  const [func] = useState(() => {
    const resetClass = (visible = true) => {
      setState((_state) => {
        return {
          ..._state,
          class: classnames(['dropdown-content', visible && 'dropdown-active'])
        };
      });
    };

    const changeVisibility = (visible = true) => {
      setState((_state) => {
        return {
          ..._state,
          class: classnames([
            'dropdown-content',
            'dropdown-active',
            'animated',
            visible ? 'dropdown-enter' : 'dropdown-leave'
          ])
        };
      });

      setTimeout(() => {
        resetClass(visible);
      }, 300);
    };

    const setVisible = debounce((visible = true) => {
      setState((_state) => {
        return {
          ..._state,
          visible
        };
      });
    });

    return {
      resetClass,
      changeVisibility,
      setVisible
    };
  });

  const trigger = cloneElement(props.children, {
    ref: triggerRef,
    onMouseEnter() {
      func.setVisible(true);
    },
    onMouseLeave() {
      func.setVisible(false);
    }
  });

  useEffect(() => {
    if (state.inited) {
      if (state.visible) {
        const offsetValue = getOffset(triggerRef.current as HTMLElement);
        const triggerWidth = triggerRef.current?.offsetWidth || 0;
        const triggerHeight = triggerRef.current?.offsetHeight || 0;

        const contentWidth = contentRef.current?.offsetWidth || 0;

        setState((_state) => {
          return {
            ..._state,
            style: {
              left: offsetValue.left + triggerWidth / 2 - contentWidth / 2 + 'px',
              top: offsetValue.top + triggerHeight + 'px'
            }
          };
        });

        func.changeVisibility(true);
      } else {
        func.changeVisibility(false);
      }
    } else {
      setState((_state) => ({
        ..._state,
        inited: true
      }));
    }
  }, [state.visible]);

  return (
    <>
      {trigger}
      {createPortal(
        <div
          className={state.class}
          style={state.style}
          ref={contentRef}
          onMouseEnter={() => {
            func.setVisible(true);
          }}
          onMouseLeave={() => {
            func.setVisible(false);
          }}
        >
          {props.content}
        </div>,
        document.body
      )}
    </>
  );
};

IzDropdown.IzDropdownMenu = Menu;
IzDropdown.IzDropdownMenuItem = MenuItem;

export default IzDropdown;
