import { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import bus from '../../utils/event-bus';
import { prefix, screenfullUrl, configOption } from '../../config';
import { EditorContext } from '../../Editor';
import { appendHandler } from '../../utils/dom';
import { ToolbarProp } from './';
import { ToolDirective } from '../../utils/content-help';
import { HoverData } from './TableShape';

export const useSreenfull = (props: ToolbarProp) => {
  const { previewOnly, editorId } = useContext(EditorContext);
  const screenfullConfig = configOption.editorExtensions?.screenfull;
  let screenfull = screenfullConfig?.instance;
  // 是否组件内部全屏标识
  const screenfullMe = useRef(false);

  // 该处使用useCallback并不是为了减少子组件渲染次数
  // 而是screenfull获取到实例后要正确的初始化该方法
  const fullScreenHandler = useCallback(() => {
    if (!screenfull) {
      bus.emit(editorId, 'errorCatcher', {
        name: 'fullScreen',
        message: 'fullScreen is undefined'
      });
      return;
    }

    if (screenfull.isEnabled) {
      screenfullMe.current = true;
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    } else {
      console.error('browser does not support screenfull!');
    }
  }, [screenfull]);

  const screenfullLoad = () => {
    // 复制实例
    screenfull = window.screenfull;
    // 注册事件
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        if (screenfullMe.current) {
          screenfullMe.current = false;
          props.updateSetting('fullscreen');
        }
      });
    }
  };

  useEffect(() => {
    let screenScript: HTMLScriptElement;
    // 非预览模式且未提供screenfull时请求cdn
    if (!previewOnly && !screenfull) {
      screenScript = document.createElement('script');
      screenScript.src = screenfullConfig?.js || screenfullUrl;
      screenScript.onload = screenfullLoad;
      screenScript.id = `${prefix}-screenfull`;

      appendHandler(screenScript, 'screenfull');
    }

    // 提供了对象直接监听事件，未提供通过screenfullLoad触发
    if (!previewOnly && screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        if (screenfullMe.current) {
          screenfullMe.current = false;
          props.updateSetting('fullscreen');
        }
      });
    }
  }, []);
  return { fullScreenHandler, screenfullLoad };
};

export const useModals = (
  uploadRef: RefObject<HTMLInputElement>,
  emitHandler: (direct: ToolDirective, params?: any) => void
) => {
  const { editorId } = useContext(EditorContext);

  const [modalData, setModalData] = useState<{
    type: 'link' | 'image' | 'help';
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
    [modalData.type]
  );

  useEffect(() => {
    bus.on(editorId, {
      name: 'openModals',
      callback(type) {
        setModalData({
          ...modalData,
          type,
          linkVisible: true
        });
      }
    });

    const uploadHandler = () => {
      bus.emit(
        editorId,
        'uploadImage',
        Array.from((uploadRef.current as HTMLInputElement).files || [])
      );

      // 清空内容，否则无法再次选取同一张图片
      (uploadRef.current as HTMLInputElement).value = '';
    };

    (uploadRef.current as HTMLInputElement).addEventListener('change', uploadHandler);
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

  const onTableSelected = useCallback((selectedShape: HoverData) => {
    emitHandler('table', { selectedShape });
  }, []);

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
