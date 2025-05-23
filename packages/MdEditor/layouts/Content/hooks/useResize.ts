import { CSSProperties, RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { MinInputBoxWidth } from '~/config';

import { ContentProps } from '../props';

const useResize = (
  props: ContentProps,
  contentRef: RefObject<HTMLDivElement>,
  resizeRef: RefObject<HTMLDivElement>
) => {
  const { inputBoxWidth, onInputBoxWidthChange } = props;
  // 向后兼容，防止以前使用px的用户的编辑器布局混乱
  const compatibledInputBoxWidth = useMemo(() => {
    return /px$/.test(`${inputBoxWidth}`) ? '50%' : inputBoxWidth;
  }, [inputBoxWidth]);

  const [inputWrapperStyle, setInputWrapperStyle] = useState<CSSProperties>({
    width: compatibledInputBoxWidth
  });

  const [resizeOperateStyle, setResizeOperateStyle] = useState<CSSProperties>({
    left: compatibledInputBoxWidth
  });

  const resizedWidth = useRef<string | number | undefined>(compatibledInputBoxWidth);

  useEffect(() => {
    const resizeMousemove = (e: MouseEvent) => {
      // 挂载后计算宽度的数值
      const maxWidth = contentRef.current?.offsetWidth || 0;

      const contentX = contentRef.current?.getBoundingClientRect().x || 0;
      // 新的宽度 = 鼠标的位置 - 图标的一半宽度 - 内容区域的横坐标
      let nextWidth = e.x - contentX;

      if (nextWidth / maxWidth < MinInputBoxWidth) {
        nextWidth = maxWidth * MinInputBoxWidth;
      } else if (nextWidth > maxWidth - maxWidth * MinInputBoxWidth) {
        nextWidth = maxWidth - maxWidth * MinInputBoxWidth;
      }

      const ibw = `${(nextWidth / maxWidth) * 100}%`;

      setInputWrapperStyle((prevState) => {
        return {
          ...prevState,
          width: ibw
        };
      });

      setResizeOperateStyle((prevState) => {
        return {
          ...prevState,
          left: ibw
        };
      });

      resizedWidth.current = ibw;
      onInputBoxWidthChange?.(ibw);
    };

    const resizeMousedown = (ev: MouseEvent) => {
      if (ev.target === resizeRef.current) {
        setResizeOperateStyle((prevState) => {
          return {
            ...prevState
          };
        });
        document.addEventListener('mousemove', resizeMousemove);
      }
    };

    const resizeMouseup = () => {
      setResizeOperateStyle((prevState) => {
        return {
          ...prevState
        };
      });
      document.removeEventListener('mousemove', resizeMousemove);
    };

    document.addEventListener('mousedown', resizeMousedown);
    document.addEventListener('mouseup', resizeMouseup);

    return () => {
      document.removeEventListener('mousedown', resizeMousedown);
      document.removeEventListener('mouseup', resizeMouseup);
      document.removeEventListener('mousemove', resizeMousemove);
    };
  }, [contentRef, onInputBoxWidthChange, resizeRef]);

  useEffect(() => {
    resizedWidth.current = compatibledInputBoxWidth;
    setInputWrapperStyle((prevState) => {
      return {
        ...prevState,
        width: compatibledInputBoxWidth
      };
    });

    setResizeOperateStyle((prevState) => {
      return {
        ...prevState,
        left: compatibledInputBoxWidth
      };
    });
  }, [compatibledInputBoxWidth]);

  useEffect(() => {
    const po = props.setting.previewOnly;

    let width: string | number | undefined = '';
    let display = '';

    if (po) {
      width = '0%';
      display = 'none';
    } else if (!props.setting.htmlPreview && !props.setting.preview) {
      width = '100%';
      display = 'none';
    } else {
      width = resizedWidth.current;
      display = 'initial';
    }

    setInputWrapperStyle((prevState) => {
      return {
        ...prevState,
        width
      };
    });

    setResizeOperateStyle((prevState) => {
      return {
        ...prevState,
        display
      };
    });
  }, [props.setting.htmlPreview, props.setting.preview, props.setting.previewOnly]);

  return {
    inputWrapperStyle,
    resizeOperateStyle
  };
};

export default useResize;
