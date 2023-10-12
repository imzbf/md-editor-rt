import { CSSProperties, RefObject, useEffect, useRef, useState } from 'react';
import { ContentProps } from '../props';

const useResize = (
  props: ContentProps,
  contentRef: RefObject<HTMLDivElement>,
  resizeRef: RefObject<HTMLDivElement>
) => {
  const [inputWrapperStyle, setInputWrapperStyle] = useState<CSSProperties>({
    width: props.inputBoxWitdh
  });

  const [resizeOperateStyle, setResizeOperateStyle] = useState<CSSProperties>({
    left: props.inputBoxWitdh
  });

  const resizedWidth = useRef<string | number | undefined>(props.inputBoxWitdh);

  useEffect(() => {
    // 挂载后计算宽度的数值
    const maxWidth = contentRef.current?.offsetWidth || 0;

    const contentX = contentRef.current?.getBoundingClientRect().x || 0;

    const resizeMousemove = (e: MouseEvent) => {
      // 新的宽度 = 鼠标的位置 - 图标的一半宽度 - 内容区域的横坐标
      let nextWidth = e.x - contentX;

      if (nextWidth < 100) {
        nextWidth = 100;
      } else if (nextWidth > maxWidth - 100) {
        nextWidth = maxWidth - 100;
      }

      setInputWrapperStyle((prevState) => {
        return {
          ...prevState,
          width: `${nextWidth}px`
        };
      });

      setResizeOperateStyle((prevState) => {
        return {
          ...prevState,
          left: `${nextWidth}px`
        };
      });

      resizedWidth.current = `${nextWidth}px`;
    };

    const resizeMousedown = () => {
      setResizeOperateStyle((prevState) => {
        return {
          ...prevState
        };
      });
      document.addEventListener('mousemove', resizeMousemove);
    };

    const resizeMouseup = () => {
      setResizeOperateStyle((prevState) => {
        return {
          ...prevState
        };
      });
      document.removeEventListener('mousemove', resizeMousemove);
    };

    resizeRef.current?.addEventListener('mousedown', resizeMousedown);
    document.addEventListener('mouseup', resizeMouseup);

    return () => {
      resizeRef.current?.removeEventListener('mousedown', resizeMousedown);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      resizeRef.current?.removeEventListener('mouseup', resizeMouseup);
    };
  }, [contentRef, resizeRef]);

  useEffect(() => {
    if (!props.setting.htmlPreview && !props.setting.preview) {
      setInputWrapperStyle((prevState) => {
        resizedWidth.current = prevState.width;

        return {
          ...prevState,
          width: '100%'
        };
      });
    } else {
      setInputWrapperStyle((prevState) => {
        return {
          ...prevState,
          width: resizedWidth.current
        };
      });
    }
  }, [props.setting.htmlPreview, props.setting.preview]);

  return { inputWrapperStyle, resizeOperateStyle };
};

export default useResize;
