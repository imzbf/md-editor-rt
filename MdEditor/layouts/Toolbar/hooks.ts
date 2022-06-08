import { RefObject, useCallback, useContext, useEffect, useRef, useState } from 'react';
import bus from '../../utils/event-bus';
import { prefix, screenfullUrl } from '../../config';
import { EditorContext } from '../../Editor';
import { appendHandler } from '../../utils/dom';
import { ToolbarProp } from './';
import { ToolDirective } from '../../utils/content-help';

export const useSreenfull = (props: ToolbarProp) => {
  const { previewOnly, extension, editorId } = useContext(EditorContext);
  const screenfullConfig = extension.editorExtensions?.screenfull;
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

  const onOk = useCallback((data: any) => {
    if (data) {
      emitHandler(modalData.type, {
        desc: data.desc,
        url: data.url
      });
    }
    onCancel();
  }, []);

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

    return () => {
      (uploadRef.current as HTMLInputElement).removeEventListener(
        'change',
        uploadHandler
      );
    };
  }, []);

  return {
    modalData,
    setModalData,
    onCancel,
    onOk
  };
};
