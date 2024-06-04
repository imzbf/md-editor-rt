import { useContext, useEffect } from 'react';
import mediumZoom from 'medium-zoom';
import { EditorContext } from '~/Editor';

import { ContentPreviewProps } from '../props';

/**
 * 放大图片
 *
 * @param props 基础属性
 * @param html 编译后的html
 */
const useZoom = (props: ContentPreviewProps, html: string) => {
  const { editorId } = useContext(EditorContext);

  useEffect(() => {
    if (props.noImgZoomIn) {
      return;
    }

    const zoomHander = () => {
      const imgs = document.querySelectorAll(`#${editorId}-preview img:not(.not-zoom)`);

      const zoom = mediumZoom(imgs, {
        background: '#00000073'
      });

      return () => {
        zoom.detach();
      };
    };

    return zoomHander();
  }, [editorId, html, props.noImgZoomIn, props.setting]);
};

export default useZoom;
