import { useContext, useEffect, useRef, useState, useCallback } from 'react';
import { ContentPreviewProps } from '../props';
import { prefix, globalConfig } from '~/config';
import { EditorContext } from '~/context';
import { CDN_IDS } from '~/static';
import { ERROR_CATCHER } from '~/static/event-name';
import { appendHandler } from '~/utils/dom';
import bus from '~/utils/event-bus';

/** 加载 ECharts，并依次执行解析、业务配置与渲染安全处理。 */
const useEcharts = (props: ContentPreviewProps) => {
  const { editorId, theme, rootRef } = useContext(EditorContext);

  const echartsRef = useRef<any>(globalConfig.editorExtensions.echarts?.instance);
  const [reRenderEcharts, setReRenderEcharts] = useState(0);

  // 同一图表的源码、实例和观察器一起管理，避免清理时依赖多组数组的下标对应。
  const charts = useRef<
    Array<{
      element: HTMLElement;
      source: string;
      instance: any;
      observer: ResizeObserver;
    }>
  >([]);

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
      charts.current = charts.current.filter(
        ({ element, source, instance, observer }) => {
          const shouldDispose =
            force ||
            !element.isConnected ||
            (rootRef?.current ? !rootRef.current.contains(element) : false);

          if (!shouldDispose) return true;

          observer.disconnect();
          instance.dispose?.();
          if (force) {
            // StrictMode 清理时 DOM 仍会保留；恢复纯文本源码与未处理状态，才能在
            // effect 重放时重新初始化，而不是跳过一个已被释放的空图表。
            element.textContent = source;
            element.removeAttribute('data-processed');
          }
          return false;
        }
      );
    },
    [rootRef]
  );

  const replaceEcharts = useCallback(() => {
    clearEchartsEffects();

    if (!props.noEcharts && echartsRef.current && rootRef?.current) {
      const { editorExtensions, echartsConfig } = globalConfig;
      const pendingSourceEles = Array.from(
        rootRef.current.querySelectorAll<HTMLElement>(
          `div.${prefix}-echarts:not([data-processed])`
        )
      );

      pendingSourceEles.forEach((item) => {
        if (item.dataset.closed === 'false') {
          return;
        }

        const baseSource = item.textContent || '';
        let instance: any;
        let observer: ResizeObserver | undefined;
        try {
          const context = {
            editorId,
            element: item
          };
          const baseOptions = editorExtensions.echarts!.parseOption!(baseSource, context);
          const options = editorExtensions.echarts!.sanitizeOption!(
            echartsConfig(baseOptions),
            context
          );
          instance = echartsRef.current.init(item, theme);

          instance.setOption(options);
          observer = new ResizeObserver(() => {
            instance.resize();
          });
          observer.observe(item);

          item.setAttribute('data-processed', '');
          charts.current.push({ element: item, source: baseSource, instance, observer });
        } catch (error: any) {
          // setOption 失败后恢复转义源码，避免留下半初始化的图表和失效实例。
          if (instance) {
            observer?.disconnect();
            instance.dispose();
            item.textContent = baseSource;
          }
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
