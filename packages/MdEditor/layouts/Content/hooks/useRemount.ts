import { useContext, useEffect } from 'react';
import { EditorContext } from '~/context';
import { ContentPreviewProps } from '../props';

/**
 * @description 不考虑 onRemount 的变化，默认开发者已经维护好该方法
 */
export const useRemount = (props: ContentPreviewProps, html: string, key: string) => {
  const { onRemount } = props;
  const { setting } = useContext(EditorContext);

  useEffect(() => {
    onRemount?.();
  }, [html, key, onRemount]);

  useEffect(() => {
    if (setting.preview || setting.htmlPreview) {
      onRemount?.();
    }
  }, [setting.preview, setting.htmlPreview, onRemount]);
};
