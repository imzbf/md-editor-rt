import { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import bus from '~/utils/event-bus';
import { prefix, screenfullUrl, configOption } from '~/config';
import { EditorContext } from '~/Editor';
import { appendHandler } from '~/utils/dom';
import { ToolDirective } from '~/utils/content-help';
import {
  CHANGE_FULL_SCREEN,
  ERROR_CATCHER,
  OPEN_MODALS,
  UPLOAD_IMAGE
} from '~/static/event-name';

import { ToolbarProps } from './';
import { HoverData } from './TableShape';

export const useSreenfull = (props: ToolbarProps) => {
  const { editorId } = useContext(EditorContext);
  const screenfullConfig = configOption.editorExtensions?.screenfull;
  let screenfull = screenfullConfig?.instance;
  // 是否组件内部全屏标识
  const screenfullMe = useRef(false);

  // 该处使用useCallback并不是为了减少子组件渲染次数
  // 而是screenfull获取到实例后要正确的初始化该方法
  const fullscreenHandler = useCallback(
    (status?: boolean) => {
      if (!screenfull) {
        bus.emit(editorId, ERROR_CATCHER, {
          name: 'fullscreen',
          message: 'fullscreen is undefined'
        });
        return;
      }

      if (screenfull.isEnabled) {
        screenfullMe.current = !screenfullMe.current;

        const targetStatus = status === undefined ? !screenfull.isFullscreen : status;

        if (targetStatus) {
          screenfull.request();
        } else {
          screenfull.exit();
        }
      } else {
        console.error('browser does not support screenfull!');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    let screenScript: HTMLScriptElement;

    const changedEvent = () => {
      props.updateSetting('fullscreen', screenfullMe.current);
    };

    // 延后插入标签
    let timer = -1;

    // 非预览模式且未提供screenfull时请求cdn
    if (!screenfull) {
      screenScript = document.createElement('script');
      screenScript.src = screenfullConfig?.js || screenfullUrl;
      screenScript.onload = () => {
        // 复制实例
        // eslint-disable-next-line react-hooks/exhaustive-deps
        screenfull = window.screenfull;
        // 注册事件
        if (screenfull && screenfull.isEnabled) {
          screenfull.on('change', changedEvent);
        }
      };
      screenScript.id = `${prefix}-screenfull`;

      timer = requestAnimationFrame(() => {
        appendHandler(screenScript, 'screenfull');
      });
    }

    // 提供了对象直接监听事件，未提供通过screenfullLoad触发
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', changedEvent);
    }

    return () => {
      // 严格模式下，需要取消一次嵌入标签
      if (!screenfull) {
        cancelAnimationFrame(timer);
      }

      if (screenfull && screenfull.isEnabled) {
        screenfull.off('change', changedEvent);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // 注册切换全屏监听
    bus.on(editorId, {
      name: CHANGE_FULL_SCREEN,
      callback: fullscreenHandler
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { fullscreenHandler };
};

export const useModals = (
  uploadRef: RefObject<HTMLInputElement>,
  emitHandler: (direct: ToolDirective, params?: any) => void
) => {
  const { editorId } = useContext(EditorContext);

  const [modalData, setModalData] = useState<{
    type: 'link' | 'image';
    linkVisible: boolean;
    clipVisible: boolean;
  }>({
    type: 'link',
    linkVisible: false,
    clipVisible: false
  });

  const onCancel = useCallback(() => {
    setModalData((_modalData) => {
      return {
        ..._modalData,
        linkVisible: false,
        clipVisible: false
      };
    });
  }, []);

  const onOk = useCallback(
    (data: any) => {
      if (data) {
        emitHandler(modalData.type, {
          desc: data.desc,
          url: data.url
        });
      }
      onCancel();
    },
    [emitHandler, modalData.type, onCancel]
  );

  useEffect(() => {
    bus.on(editorId, {
      name: OPEN_MODALS,
      callback(type) {
        setModalData((_modalData) => {
          return {
            ..._modalData,
            type,
            linkVisible: true
          };
        });
      }
    });

    const uploadHandler = () => {
      bus.emit(
        editorId,
        UPLOAD_IMAGE,
        Array.from((uploadRef.current as HTMLInputElement).files || [])
      );

      // 清空内容，否则无法再次选取同一张图片
      (uploadRef.current as HTMLInputElement).value = '';
    };

    (uploadRef.current as HTMLInputElement).addEventListener('change', uploadHandler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    modalData,
    setModalData,
    onCancel,
    onOk
  };
};

export const useDropdownState = (
  emitHandler: (direct: ToolDirective, params?: any) => void
) => {
  const [visible, setVisible] = useState({
    title: false,
    catalog: false,
    // 图片上传下拉
    image: false,
    // 表格预选
    table: false,
    // mermaid
    mermaid: false,
    katex: false
  });

  const onTitleChange = useCallback((v: boolean) => {
    setVisible((_visible) => {
      return {
        ..._visible,
        title: v
      };
    });
  }, []);

  const onTitleClose = useCallback(() => {
    setVisible((_visible) => {
      return {
        ..._visible,
        title: false
      };
    });
  }, []);

  const onImageChange = useCallback((v: boolean) => {
    setVisible((_vis) => {
      return {
        ..._vis,
        image: v
      };
    });
  }, []);

  const onImageClose = useCallback(() => {
    setVisible((_visible) => {
      return {
        ..._visible,
        image: false
      };
    });
  }, []);

  const onTableChange = useCallback((v: boolean) => {
    setVisible((_vis) => {
      return {
        ..._vis,
        table: v
      };
    });
  }, []);

  const onTableSelected = useCallback(
    (selectedShape: HoverData) => {
      emitHandler('table', { selectedShape });
    },
    [emitHandler]
  );

  const onMermaidChange = useCallback((v: boolean) => {
    setVisible((_vis) => {
      return {
        ..._vis,
        mermaid: v
      };
    });
  }, []);

  const onMermaidClose = useCallback(() => {
    setVisible((_visible) => {
      return {
        ..._visible,
        mermaid: false
      };
    });
  }, []);

  const onKatexChange = useCallback((v: boolean) => {
    setVisible((_vis) => {
      return {
        ..._vis,
        katex: v
      };
    });
  }, []);

  const onKatexClose = useCallback(() => {
    setVisible((_visible) => {
      return {
        ..._visible,
        katex: false
      };
    });
  }, []);

  return {
    visible,
    onTitleChange,
    onTitleClose,
    onImageChange,
    onImageClose,
    onTableChange,
    onTableSelected,
    onMermaidChange,
    onMermaidClose,
    onKatexChange,
    onKatexClose
  };
};
