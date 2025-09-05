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
  const mermaidSourceEles = useRef<HTMLElement[]>([]);

  const configEcharts = useCallback(() => {
    if (!props.noEcharts && echartsRef.current) {
      setReRenderEcharts((prev) => prev + 1);
    }
  }, [props.noEcharts]);

  // 监听 theme 变化（等价于 Vue watch）
  useEffect(() => {
    configEcharts();
  }, [theme, configEcharts]);

  // onMounted
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

  const clearEchartsEffects = useCallback(() => {
    echartsInstances.current.forEach((instance) => instance.dispose());
    observers.current.forEach((observer) => observer.disconnect());

    echartsInstances.current = [];
    mermaidSourceEles.current = [];
    observers.current = [];
  }, []);

  const replaceEcharts = useCallback(() => {
    clearEchartsEffects();

    if (!props.noEcharts && echartsRef.current && rootRef!.current) {
      mermaidSourceEles.current = Array.from(
        rootRef!.current.querySelectorAll<HTMLElement>(
          `#${editorId} div.${prefix}-echarts:not([data-processed])`
        )
      );

      mermaidSourceEles.current.forEach((item) => {
        if (item.dataset.closed === 'false') return;

        try {
          // eslint-disable-next-line @typescript-eslint/no-implied-eval
          const options = new Function(`return ${item.innerText}`)();
          const ins = echartsRef.current.init(item, theme);

          ins.setOption(options);
          item.setAttribute('data-processed', '');

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

  // onBeforeUnmount
  useEffect(() => {
    return () => {
      clearEchartsEffects();
    };
  }, [clearEchartsEffects]);

  return { reRenderEcharts, replaceEcharts };
};

export default useEcharts;
