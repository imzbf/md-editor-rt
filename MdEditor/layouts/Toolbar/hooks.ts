import { useEffect } from 'react';
import { ToolbarProp } from './';

export const useSreenfull = (props: ToolbarProp) => {
  let { screenfull } = props;

  const fullScreenHandler = () => {
    if (screenfull.isEnabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    } else {
      console.error('browser does not support screenfull!');
    }
  };

  const screenfullLoad = () => {
    // 复制实例
    screenfull = window.screenfull;

    // 注册事件
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        props.updateSetting(!props.setting.fullscreen, 'fullscreen');
      });
    }
  };

  useEffect(() => {
    if (screenfull && screenfull.isEnabled) {
      screenfull.on('change', () => {
        props.updateSetting(!props.setting.fullscreen, 'fullscreen');
      });
    }
  }, []);

  return { fullScreenHandler, screenfullLoad };
};
