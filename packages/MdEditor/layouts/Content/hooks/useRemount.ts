import { useEffect } from 'react';
import { ContentPreviewProps } from '../props';

/**
 * @description 不考虑 onRemount 的变化，默认开发者已经维护好该方法
 */
export const useRemount = (props: ContentPreviewProps, html: string, key: string) => {
  const { setting, onRemount } = props;

  useEffect(() => {
    onRemount?.();
  }, [html, key, onRemount]);

  useEffect(() => {
    if (setting.preview || setting.htmlPreview) {
      onRemount?.();
    }
  }, [setting.preview, setting.htmlPreview, onRemount]);
};
