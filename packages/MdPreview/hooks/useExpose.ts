import { ForwardedRef, useImperativeHandle } from 'react';
import eventBus from '~/utils/event-bus';
import { ExposePreviewParam, MdPreviewStaticProps } from '~/type';
import { RERENDER } from '~/static/event-name';

export const useExpose = (props: MdPreviewStaticProps, ref: ForwardedRef<unknown>) => {
  const { editorId } = props;

  useImperativeHandle(
    ref,
    () => {
      const exposeParam: ExposePreviewParam = {
        rerender() {
          eventBus.emit(editorId, RERENDER);
        }
      };

      return exposeParam;
    },
    [editorId]
  );
};
