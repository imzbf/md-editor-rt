import { ForwardedRef, useImperativeHandle } from 'react';
import { RERENDER } from '~/static/event-name';
import { ExposePreviewParam, MdPreviewStaticProps } from '~/type';
import eventBus from '~/utils/event-bus';

export const useExpose = (props: MdPreviewStaticProps, ref: ForwardedRef<unknown>) => {
  const { editorId } = props;

  useImperativeHandle(ref, () => {
    const exposeParam: ExposePreviewParam = {
      rerender() {
        eventBus.emit(editorId, RERENDER);
      }
    };

    return exposeParam;
  }, [editorId]);
};
