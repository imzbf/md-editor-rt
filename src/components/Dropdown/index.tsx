import { debounce } from '@vavt/util';
import { cloneElement, CSSProperties, useRef, useState, useEffect, ReactNode, ReactElement } from 'react';
import { createPortal } from 'react-dom';
import { getOffset, classnames } from '@/utils';
import Menu from './Menu';
import MenuItem from './MenuItem';

interface IzDropdownProp {
  children: ReactElement;
  content: ReactNode;
}

const IzDropdown = (props: IzDropdownProp) => {
  const triggerRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const portalRef = useRef<HTMLElement>(null);

  const initedRef = useRef(false);

  const [state, setState] = useState<{
    visible: boolean;
    style: CSSProperties;
    class: string;
  }>({
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
          visible: visible as boolean
        };
      });
    });

    return {
      resetClass,
      changeVisibility,
      setVisible
    };
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  const trigger = cloneElement(props.children, {
    ref: triggerRef,
    onMouseEnter() {
      void func.setVisible(true);
    },
    onMouseLeave() {
      void func.setVisible(false);
    }
  } as any);

  useEffect(() => {
    portalRef.current = document.body;
  }, []);

  useEffect(() => {
    if (initedRef.current) {
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
      initedRef.current = true;
    }
  }, [func, state.visible]);

  return (
    <>
      {trigger}
      {portalRef.current &&
        createPortal(
          <div
            className={state.class}
            style={state.style}
            ref={contentRef}
            onMouseEnter={() => {
              void func.setVisible(true);
            }}
            onMouseLeave={() => {
              void func.setVisible(false);
            }}
          >
            {props.content}
          </div>,
          portalRef.current
        )}
    </>
  );
};

IzDropdown.IzDropdownMenu = Menu;
IzDropdown.IzDropdownMenuItem = MenuItem;

export default IzDropdown;
