import {
  CSSProperties,
  memo,
  ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState
} from 'react';
import { createPortal } from 'react-dom';
import Icon from '../Icon';
import { globalConfig, prefix } from '~/config';
import { EditorContext } from '~/context';
import { getZIndexIncrement } from '~/utils';
import { getFocusableElements, keyMove } from '~/utils/dom';

export type ModalProps = Readonly<{
  title?: ReactNode;
  visible?: boolean;
  width?: string;
  height?: string;
  onClose?: () => void;
  showAdjust?: boolean;
  isFullscreen?: boolean;
  onAdjust?: (val: boolean) => void;
  children?: any;
  className?: string;
  // style只能是对象，搞不了字符串
  style?: CSSProperties;
  showMask?: boolean;
}>;

const toClass = `${prefix}-modal-container`;

const Modal = (props: ModalProps) => {
  const { theme, rootRef } = useContext(EditorContext);

  const { onClose, onAdjust, style, visible = false, showMask = true } = props;
  const [modalVisible, setModalVisible] = useState(visible);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalHeaderRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const [body, setBody] = useState<Element | ShadowRoot | null>(null);

  // 创建的弹窗容器，存放在document.body末尾
  const containerRef = useRef<HTMLDivElement>(null);

  const [state, setState] = useState<{
    maskStyle: CSSProperties;
    modalStyle: CSSProperties;
    initPos: CSSProperties;
    historyPos: CSSProperties;
  }>({
    maskStyle: {
      zIndex: -1
    },
    modalStyle: {
      zIndex: -1
    },
    initPos: {
      insetInlineStart: '0px',
      insetBlockStart: '0px'
    },
    historyPos: {
      insetInlineStart: '0px',
      insetBlockStart: '0px'
    }
  });

  useEffect(() => {
    if (visible) {
      // 先记录返回目标，再挂载 Portal，避免子控件 autoFocus 覆盖打开前的焦点。
      const root = (rootRef?.current?.getRootNode() || document) as Document | ShadowRoot;
      previousFocusRef.current = root.activeElement as HTMLElement | null;
    }
  }, [rootRef, visible]);

  useEffect(() => {
    const rootNode = rootRef?.current?.getRootNode();
    setBody(rootNode instanceof ShadowRoot ? rootNode : document.body);
  }, [rootRef]);

  useEffect(() => {
    if (props.isFullscreen || !visible || !modalHeaderRef.current) return;
    return keyMove(modalHeaderRef.current, (left, top) => {
      setState((_state) => ({
        ..._state,
        initPos: {
          insetInlineStart: left + 'px',
          insetBlockStart: top + 'px'
        }
      }));
    });
  }, [body, props.isFullscreen, visible]);

  useEffect(() => {
    // 退出动画期间保留视觉内容，但不再让隐藏中的控件参与键盘导航。
    if (containerRef.current) containerRef.current.inert = !visible;

    if (visible) {
      setModalVisible(true);
    } else {
      const timer = window.setTimeout(() => {
        setModalVisible(false);
      }, 150);

      // 快速重开时取消上一次退出动画，避免旧定时器再次隐藏弹窗。
      return () => clearTimeout(timer);
    }
  }, [body, visible]);

  useEffect(() => {
    const modal = modalRef.current;
    if (!visible || !modalVisible || !modal) return;

    // Portal 挂载且可见后再测量；定位与初始焦点只在本次打开时设置。
    const maskStyle = {
      zIndex: globalConfig.editorConfig.zIndex! + getZIndexIncrement()
    };
    const modalStyle = {
      zIndex: globalConfig.editorConfig.zIndex! + getZIndexIncrement()
    };
    const initPos = {
      insetInlineStart:
        (document.documentElement.clientWidth - modal.offsetWidth) / 2 + 'px',
      insetBlockStart:
        (document.documentElement.clientHeight - modal.offsetHeight) / 2 + 'px'
    };
    setState((_state) => ({ ..._state, maskStyle, modalStyle, initPos }));

    const root = modal.getRootNode() as Document | ShadowRoot;
    const previousFocus = previousFocusRef.current;
    const modalBody = modal.querySelector<HTMLElement>(`.${prefix}-modal-body`)!;

    if (!modal.contains(root.activeElement)) {
      // 等容器退出 inert 状态后再进入表单；空弹窗仍可通过关闭按钮接收按键。
      const initialFocus =
        getFocusableElements(modalBody)[0] || getFocusableElements(modal)[0] || modal;
      initialFocus.focus({ preventScroll: true });
    }

    return () => {
      const activeElement = root.activeElement;
      // 动作若已将焦点交给其他界面，则保留该结果；关闭和卸载时才归还原焦点。
      if (
        previousFocus?.isConnected &&
        (!activeElement ||
          activeElement === document.body ||
          modal.contains(activeElement))
      ) {
        previousFocus.focus({ preventScroll: true });
      }
    };
  }, [body, modalVisible, visible]);

  return (
    <>
      {body &&
        createPortal(
          <div ref={containerRef} className={toClass} data-theme={theme}>
            <div
              className={props.className}
              style={{ ...style, display: modalVisible ? 'block' : 'none' }}
              aria-hidden={!visible || undefined}
            >
              {showMask && (
                <div
                  className={`${prefix}-modal-mask`}
                  style={state.maskStyle}
                  onClick={onClose}
                />
              )}
              <div
                className={`${prefix}-modal ${visible ? 'zoom-in' : 'zoom-out'}`}
                style={{
                  ...state.modalStyle,
                  ...state.initPos,
                  width: props.isFullscreen ? '100%' : props.width,
                  height: props.isFullscreen ? '100%' : props.height
                }}
                ref={modalRef}
                role="dialog"
                aria-modal={showMask || undefined}
                aria-labelledby={props.title ? titleId : undefined}
                aria-label={props.title ? undefined : 'Dialog'}
                tabIndex={-1}
                onKeyDown={(event) => {
                  if (
                    !visible ||
                    event.defaultPrevented ||
                    event.nativeEvent.isComposing
                  ) {
                    return;
                  }

                  if (event.key === 'Escape') {
                    event.preventDefault();
                    event.stopPropagation();
                    onClose?.();
                    return;
                  }

                  if (event.key !== 'Tab' || !showMask) return;
                  const modal = event.currentTarget;
                  const root = modal.getRootNode() as Document | ShadowRoot;
                  const items = getFocusableElements(modal);
                  const first = items[0];
                  const last = items.at(-1);
                  const atBoundary = event.shiftKey
                    ? root.activeElement === first || root.activeElement === modal
                    : root.activeElement === last;

                  // 有遮罩的弹窗限制 Tab 范围；无罩弹窗允许继续访问页面。
                  if (!first || atBoundary) {
                    event.preventDefault();
                    const next = event.shiftKey ? last : first;
                    (next || modal).focus({ preventScroll: true });
                  }
                }}
              >
                <div
                  id={titleId}
                  className={`${prefix}-modal-header`}
                  ref={modalHeaderRef}
                >
                  {props.title || ''}
                </div>
                {/* 图标按钮使用固定的无障碍名称，避免扩展语言包配置。 */}
                <div className={`${prefix}-modal-func`}>
                  {props.showAdjust && (
                    <button
                      className={`${prefix}-modal-adjust`}
                      type="button"
                      aria-label={props.isFullscreen ? 'Restore' : 'Maximize'}
                      onClick={(e) => {
                        e.stopPropagation();

                        // 全屏时，保存上次位置
                        if (!props.isFullscreen) {
                          setState((_state) => ({
                            ..._state,
                            historyPos: _state.initPos,
                            initPos: {
                              insetInlineStart: '0',
                              insetBlockStart: '0'
                            }
                          }));
                        } else {
                          setState((_state) => ({
                            ..._state,
                            initPos: _state.historyPos
                          }));
                        }

                        onAdjust?.(!props.isFullscreen);
                      }}
                    >
                      <Icon name={props.isFullscreen ? 'minimize' : 'maximize'} />
                    </button>
                  )}
                  <button
                    className={`${prefix}-modal-close`}
                    type="button"
                    aria-label="Close"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClose?.();
                    }}
                  >
                    <Icon name="close" />
                  </button>
                </div>
                <div className={`${prefix}-modal-body`}>{props.children}</div>
              </div>
            </div>
          </div>,
          body
        )}
    </>
  );
};

export default memo(Modal);
