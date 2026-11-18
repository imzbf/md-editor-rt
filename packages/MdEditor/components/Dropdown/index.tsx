import {
  ReactElement,
  ComponentPropsWithRef,
  cloneElement,
  CSSProperties,
  FocusEvent,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
  Ref,
  useId,
  memo
} from 'react';

import { prefix } from '~/config';
import { getFocusableElements } from '~/utils/dom';

interface DropdownProps {
  overlay: ReactNode;
  visible: boolean;
  children: ReactElement<ComponentPropsWithRef<'button'>>;
  onChange: (v: boolean) => void;
  relative?: string;
  disabled?: boolean;
}

const HIDDEN_CLASS = `${prefix}-dropdown-hidden`;
const MENU_ITEM_SELECTOR =
  '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

// 菜单项通过方向键聚焦，包括 tabindex 为 -1 的项目。
const getMenuItems = (overlay: HTMLElement) => {
  return Array.from(overlay.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (item) =>
      !item.matches(':disabled, [aria-disabled="true"]') &&
      !item.closest('[hidden], [inert], [aria-hidden="true"]') &&
      item.getClientRects().length > 0 &&
      getComputedStyle(item).visibility === 'visible'
  );
};

const DropDown = (props: DropdownProps) => {
  const { relative = 'html', onChange, disabled } = props;
  const visible = props.visible && !disabled;
  const overlayId = useId();
  const [overlayStyle, setOverlayStyle] = useState<CSSProperties>({});

  const triggerRef = useRef<HTMLButtonElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<'first' | 'last' | null>(null);
  const hiddenTimer = useRef(-1);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  // 回调更新不应取消已经排队的关闭；只在显隐变化或卸载时清理定时器。
  useEffect(() => {
    return () => clearTimeout(hiddenTimer.current);
  }, [visible]);

  const focusOverlay = useCallback((position: 'first' | 'last') => {
    const overlay = overlayRef.current!;
    const items = getMenuItems(overlay);
    const item = position === 'last' ? items.at(-1) : items[0];

    if (item) item.tabIndex = -1;
    // 自定义下拉内容也可以是表单；没有菜单项时保留其原生键盘行为。
    (item || getFocusableElements(overlay)[0] || overlay).focus({ preventScroll: true });
  }, []);

  const open = (position?: 'first' | 'last') => {
    if (disabled) return;
    clearTimeout(hiddenTimer.current);
    if (visible && position) {
      focusOverlay(position);
      return;
    }

    const triggerEle = triggerRef.current;
    const overlayEle = overlayRef.current;

    // 尝试移除元素不存在的潜在问题（https://github.com/imzbf/md-editor-v3/issues/308）
    if (!triggerEle || !overlayEle) {
      return;
    }

    const { width, height } = triggerEle.getBoundingClientRect();
    const rootNode = triggerEle.getRootNode() as Document | ShadowRoot;
    const relativeElement = rootNode.querySelector(relative);
    const scrollLeft = relativeElement?.scrollLeft || 0;
    const overlayWidth = overlayEle.offsetWidth;
    const left = triggerEle.offsetLeft + (width - overlayWidth) / 2 - scrollLeft;
    const maxLeft = scrollLeft + (relativeElement?.clientWidth || 0) - overlayWidth;

    // 居中对齐触发器，并限制在相对容器的左右边界内。
    setOverlayStyle({
      insetBlockStart: triggerEle.offsetTop + height + 'px',
      insetInlineStart: Math.max(0, Math.min(left, maxLeft)) + 'px'
    });

    pendingFocus.current = position || null;
    onChange(true);
  };

  const leaveHidden = (event: MouseEvent<HTMLElement>) => {
    // Portal 事件仍沿 React 树冒泡，只处理菜单实际 DOM 内的交互。
    if (!visible || !event.currentTarget.contains(event.target as Node)) return;
    clearTimeout(hiddenTimer.current);
    hiddenTimer.current = window.setTimeout(() => {
      const root = triggerRef.current?.getRootNode() as Document | ShadowRoot;
      const activeElement = root?.activeElement;

      // 跨过触发器与菜单间隙后会取消定时器；鼠标移走也不打断键盘操作。
      if (
        !triggerRef.current?.contains(activeElement) &&
        !overlayRef.current?.contains(activeElement)
      ) {
        onChangeRef.current(false);
      }
    }, 10);
  };

  const leaveFocus = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget as Node | null;
    if (
      visible &&
      event.currentTarget.contains(event.target) &&
      !triggerRef.current?.contains(next) &&
      !overlayRef.current?.contains(next)
    ) {
      onChange(false);
    }
  };

  // 等受控的 visible 提交到 DOM 后再聚焦，隐藏状态下的元素无法接收焦点。
  useEffect(() => {
    if (visible) {
      // 菜单只有触发器参与 Tab 顺序，项目由方向键访问；也排除禁用项的 tabindex。
      overlayRef
        .current!.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)
        .forEach((item) => {
          item.tabIndex = -1;
        });
      if (pendingFocus.current) {
        focusOverlay(pendingFocus.current);
        pendingFocus.current = null;
      }
    } else {
      pendingFocus.current = null;
      const root = overlayRef.current?.getRootNode() as Document | ShadowRoot;
      if (overlayRef.current?.contains(root?.activeElement)) {
        triggerRef.current?.focus({ preventScroll: true });
      }
      if (disabled && props.visible) onChange(false);
    }
  }, [disabled, focusOverlay, onChange, props.visible, visible]);

  const keydown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      disabled ||
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.ctrlKey ||
      event.metaKey ||
      (event.altKey && event.key !== 'Tab') ||
      !event.currentTarget.contains(event.target as Node)
    )
      return;

    const fromTrigger = event.currentTarget === triggerRef.current;
    if (fromTrigger && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      open(event.key === 'ArrowUp' ? 'last' : 'first');
      return;
    }
    if (!visible) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      triggerRef.current?.focus({ preventScroll: true });
      onChange(false);
      return;
    }

    const item = event.target as HTMLElement;
    // 不接管自定义菜单项内输入框、按钮等子控件的按键。
    if (!fromTrigger && !item.matches(MENU_ITEM_SELECTOR)) return;
    if (event.key === 'Tab') {
      triggerRef.current?.focus({ preventScroll: true });
      onChange(false);
      return;
    }
    if (fromTrigger) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (!event.repeat) item.click();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;

    const items = getMenuItems(event.currentTarget);
    const index = items.indexOf(item);
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowDown':
        nextIndex = (index + 1) % items.length;
        break;
      case 'ArrowUp':
        nextIndex = (index - 1 + items.length) % items.length;
        break;
      case 'Home':
        nextIndex = 0;
        break;
      default:
        nextIndex = items.length - 1;
    }
    event.preventDefault();
    event.stopPropagation();
    const next = items[nextIndex];
    if (next) {
      next.tabIndex = -1;
      next.focus({ preventScroll: true });
    }
  };

  // React 18 的 ref 在元素上，React 19 移到了 props；读取数据描述符可避开兼容警告。
  const originalRef = (Object.getOwnPropertyDescriptor(props.children.props, 'ref')
    ?.value || Object.getOwnPropertyDescriptor(props.children, 'ref')?.value) as
    | Ref<HTMLButtonElement>
    | undefined;
  const setTriggerRef = useCallback(
    (node: HTMLButtonElement | null) => {
      triggerRef.current = node;
      if (typeof originalRef === 'function') {
        const cleanup = originalRef(node);
        // React 19 的回调 ref 可返回清理函数，此时卸载不会再调用 ref(null)。
        if (typeof cleanup === 'function') {
          return () => {
            triggerRef.current = null;
            cleanup();
          };
        }
      } else if (originalRef) {
        originalRef.current = node;
      }
    },
    [originalRef]
  );

  const trigger = cloneElement(props.children, {
    ref: setTriggerRef,
    key: 'cloned-dropdown-trigger',
    'aria-haspopup': 'menu',
    'aria-expanded': visible,
    'aria-controls': overlayId,
    onMouseEnter: (event) => {
      props.children.props.onMouseEnter?.(event);
      if (!event.defaultPrevented) open();
    },
    onMouseLeave: (event) => {
      props.children.props.onMouseLeave?.(event);
      leaveHidden(event);
    },
    onBlur: (event) => {
      props.children.props.onBlur?.(event);
      leaveFocus(event);
    },
    onKeyDown: (event) => {
      props.children.props.onKeyDown?.(event);
      keydown(event);
    },
    onClick: (event) => {
      props.children.props.onClick?.(event);
      if (event.defaultPrevented) return;
      // 原生按钮的 Enter/空格和辅助技术共用 click，避免重复模拟激活。
      if (event.detail === 0) open('first');
      else if (!visible) open();
    }
  });

  // 列表内容
  const overlay = (
    <div
      id={overlayId}
      className={`${prefix}-dropdown ${visible ? '' : HIDDEN_CLASS}`}
      style={overlayStyle}
      ref={overlayRef}
      tabIndex={-1}
      aria-hidden={!visible}
      onMouseEnter={(event) => {
        if (event.currentTarget.contains(event.target as Node)) {
          clearTimeout(hiddenTimer.current);
        }
      }}
      onMouseLeave={leaveHidden}
      onBlur={leaveFocus}
      onKeyDown={keydown}
      onClickCapture={(event) => {
        const item = (event.target as HTMLElement).closest(MENU_ITEM_SELECTOR);
        if (!item || !event.currentTarget.contains(item)) return;
        if (disabled || item.matches(':disabled, [aria-disabled="true"]')) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        // 先恢复触发器，再执行菜单动作；新弹窗才能记住可见的返回目标。
        triggerRef.current?.focus({ preventScroll: true });
        onChange(false);
      }}
    >
      <div className={`${prefix}-dropdown-overlay`}>
        {props.overlay instanceof Array ? props.overlay[0] : props.overlay}
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

export default memo(DropDown);
