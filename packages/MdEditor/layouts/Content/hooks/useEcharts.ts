import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { prefix, globalConfig } from '~/config';
import { EditorContext } from '~/context';
import { CDN_IDS } from '~/static';
import { ERROR_CATCHER } from '~/static/event-name';
import { appendHandler } from '~/utils/dom';
import bus from '~/utils/event-bus';
import { ContentPreviewProps } from '../props';

const useEcharts = (props: ContentPreviewProps) => {
  const { editorId, theme, rootRef } = useContext(EditorContext);

  const echartsRef = useRef<any>(globalConfig.editorExtensions.echarts?.instance);
  const [reRenderEcharts, setReRenderEcharts] = useState(0);

  const echartsInstances = useRef<any[]>([]);
  const observers = useRef<ResizeObserver[]>([]);
  const echartsSourceEles = useRef<HTMLElement[]>([]);

  const configEcharts = useCallback(() => {
    if (!props.noEcharts && echartsRef.current) {
      setReRenderEcharts((prev) => prev + 1);
    }
  }, [props.noEcharts]);

  useEffect(() => {
    configEcharts();
  }, [theme, configEcharts]);

  useEffect(() => {
    if (props.noEcharts || echartsRef.current) return;
    const { editorExtensions, editorExtensionsAttrs } = globalConfig;

    const jsSrc = editorExtensions.echarts!.js as string;

    appendHandler(
      'script',
      {
        ...editorExtensionsAttrs.echarts?.js,
        src: jsSrc,
        id: CDN_IDS.echarts,
        onload() {
          echartsRef.current = window.echarts;
          configEcharts();
        }
      },
      'echarts'
    );
  }, [props.noEcharts, configEcharts]);

  const clearEchartsEffects = useCallback(
    (force = false) => {
      const sourceEles = echartsSourceEles.current;

      if (!sourceEles.length) {
        if (force) {
          echartsInstances.current.forEach((instance) => instance?.dispose?.());
          observers.current.forEach((observer) => observer?.disconnect?.());

          echartsInstances.current = [];
          observers.current = [];
          echartsSourceEles.current = [];
        }

        return;
      }

      const nextSourceEles: HTMLElement[] = [];
      const nextInstances: any[] = [];
      const nextObservers: ResizeObserver[] = [];

      sourceEles.forEach((element, index) => {
        const instance = echartsInstances.current[index];
        const observer = observers.current[index];
        const shouldDispose =
          force ||
          !element ||
          !element.isConnected ||
          (rootRef?.current ? !rootRef.current.contains(element) : false);

        if (shouldDispose) {
          instance?.dispose?.();
          observer?.disconnect?.();
          return;
        }

        nextSourceEles.push(element);

        if (instance) {
          nextInstances.push(instance);
        }

        if (observer) {
          nextObservers.push(observer);
        }
      });

      echartsSourceEles.current = nextSourceEles;
      echartsInstances.current = nextInstances;
      observers.current = nextObservers;
    },
    [rootRef]
  );

  const replaceEcharts = useCallback(() => {
    clearEchartsEffects();

    if (!props.noEcharts && echartsRef.current && rootRef?.current) {
      const pendingSourceEles = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(
          `#${editorId} div.${prefix}-echarts:not([data-processed])`
        )
      );

      pendingSourceEles.forEach((item) => {
        if (item.dataset.closed === 'false') {
          return;
        }

        try {
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const options = new Function(`return ${item.innerText}`)();
          const ins = echartsRef.current.init(item, theme);

          ins.setOption(options);
          item.setAttribute('data-processed', '');

          echartsSourceEles.current.push(item);
          echartsInstances.current.push(ins);

          const observer = new ResizeObserver(() => {
            ins.resize();
          });
          observer.observe(item);
          observers.current.push(observer);
        } catch (error: any) {
          bus.emit(editorId, ERROR_CATCHER, {
            name: 'echarts',
            message: error?.message,
            error
          });
        }
      });
    }
  }, [props.noEcharts, rootRef, editorId, theme, clearEchartsEffects]);

  useEffect(() => {
    return () => {
      clearEchartsEffects(true);
    };
  }, [clearEchartsEffects]);

  return { reRenderEcharts, replaceEcharts };
};

export default useEcharts;
