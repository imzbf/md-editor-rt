import { prefix } from '../../config';
import { EditorContext } from '../../Editor';
import { appendHandler } from '../../utils/dom';
import { useCallback, useContext, useEffect } from 'react';
import { ToolbarProp } from './';

export const useSreenfull = (props: ToolbarProp) => {
  let { screenfull } = props;
  const { previewOnly } = useContext(EditorContext);

  const fullScreenHandler = useCallback(() => {
    if (screenfull.isEnabled) {
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
        props.updateSetting('fullscreen');
      });
    }
  };

  useEffect(() => {
    let screenScript: HTMLScriptElement;
    // 非预览模式且未提供screenfull时请求cdn
    if (!previewOnly && !props.screenfull) {
      screenScript = document.createElement('script');
      screenScript.src = props.screenfullJs;
      screenScript.addEventListener('load', screenfullLoad);
      screenScript.id = `${prefix}-screenfull`;

      appendHandler(screenScript);
    }

    // 提供了对象直接监听事件，未提供通过screenfullLoad触发
    if (!previewOnly && screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        props.updateSetting('fullscreen');
      });
    }

    return () => {
      if (!previewOnly && !props.screenfull) {
        document.head.removeChild(screenScript);
      }
    };
  }, []);
  return { fullScreenHandler, screenfullLoad };
};
