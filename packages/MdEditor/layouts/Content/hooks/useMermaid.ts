import { randomId } from '@vavt/util';
import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState
} from 'react';
import { ContentPreviewProps } from '../props';
import { prefix, globalConfig } from '~/config';
import { EditorContext } from '~/context';
import { CDN_IDS } from '~/static';
import { ERROR_CATCHER } from '~/static/event-name';
import { TtlLruCache } from '~/utils/cache';
import { appendHandler } from '~/utils/dom';
import eventBus from '~/utils/event-bus';

// 异步清洗可能在普通 effect 前完成，提交阶段就要使旧结果失效；服务端使用普通 effect。
const useClientLayoutEffect =
  typeof document === 'undefined' ? useEffect : useLayoutEffect;

interface MermaidResult {
  svg: string;
  bindFunctions?: (element: HTMLElement) => void;
}

interface MermaidInstance {
  initialize: (options: Record<string, any>) => void;
  render: (id: string, code: string, container: HTMLElement) => Promise<MermaidResult>;
  mermaidAPI?: { defaultConfig?: { secure?: string[] } };
}

// initialize 会修改 Mermaid 的共享配置，必须和 render 一起排队；只依赖第三方
// render 自己的队列，仍会被另一预览的 initialize 改写主题或安全策略。
const renderQueues = new WeakMap<object, Promise<void>>();
const enqueueRender = <T>(instance: object, render: () => Promise<T>): Promise<T> => {
  const task = (renderQueues.get(instance) || Promise.resolve()).then(render);
  renderQueues.set(
    instance,
    task.then(
      () => {},
      () => {}
    )
  );
  return task;
};

/** 加载 Mermaid，按预览实例缓存已清洗的 SVG，并绑定当前 DOM 的交互事件。 */
const useMermaid = (props: ContentPreviewProps) => {
  const { editorId, theme, rootRef } = useContext(EditorContext);
  const { editorExtensions, editorExtensionsAttrs, mermaidConfig } = globalConfig;
  const mermaidRef = useRef(
    editorExtensions.mermaid!.instance as MermaidInstance | undefined
  );
  const [cache] = useState(
    () => new TtlLruCache<string, MermaidResult>({ max: 1000, ttl: 600000 })
  );
  const [bound] = useState(() => new WeakSet<HTMLElement>());
  const [pending] = useState(
    () => new WeakMap<HTMLElement, { generation: number; promise: Promise<void> }>()
  );
  const generation = useRef(0);
  const disposed = useRef(false);
  const reRenderRef = useRef(0);
  const [reRender, setReRender] = useState(0);

  const getCachedMermaid = useCallback(
    (block: string | undefined, code: string) => {
      return cache.get(JSON.stringify([reRenderRef.current, block, code]));
    },
    [cache]
  );

  const invalidateMermaid = useCallback(() => {
    generation.current += 1;
    cache.clear();
    reRenderRef.current += 1;
    setReRender(reRenderRef.current);
  }, [cache]);

  useClientLayoutEffect(() => {
    // React StrictMode 会重放挂载 effect，第二次 setup 必须恢复可用状态。
    disposed.current = false;
    return () => {
      disposed.current = true;
      generation.current += 1;
      cache.clear();
    };
  }, [cache]);

  const previous = useRef({
    theme,
    sanitizeMermaid: props.sanitizeMermaid,
    modelValue: props.modelValue
  });
  useClientLayoutEffect(() => {
    const last = previous.current;
    previous.current = {
      theme,
      sanitizeMermaid: props.sanitizeMermaid,
      modelValue: props.modelValue
    };
    if (last.theme !== theme || last.sanitizeMermaid !== props.sanitizeMermaid) {
      invalidateMermaid();
    } else if (last.modelValue !== props.modelValue) {
      // Markdown 编译可能仍在防抖等待中，先阻止旧文档的异步结果写回。
      generation.current += 1;
    }
  }, [invalidateMermaid, props.modelValue, props.sanitizeMermaid, theme]);

  useEffect(() => {
    if (props.noMermaid || mermaidRef.current) return;

    const jsSrc = editorExtensions.mermaid!.js as string;
    const loaded = (instance: MermaidInstance) => {
      if (disposed.current) return;
      mermaidRef.current = instance;
      invalidateMermaid();
    };

    if (/\.mjs/.test(jsSrc)) {
      appendHandler('link', {
        ...editorExtensionsAttrs.mermaid?.js,
        rel: 'modulepreload',
        href: jsSrc,
        id: CDN_IDS.mermaidM
      });

      import(
        /* @vite-ignore */
        /* webpackIgnore: true */
        jsSrc
      )
        .then((module) => loaded(module.default as MermaidInstance))
        .catch((error) => {
          if (disposed.current) return;
          eventBus.emit(editorId, ERROR_CATCHER, {
            name: 'mermaid',
            message: `Failed to load mermaid module: ${error.message}`,
            error
          });
        });
    } else {
      appendHandler(
        'script',
        {
          ...editorExtensionsAttrs.mermaid?.js,
          src: jsSrc,
          id: CDN_IDS.mermaid,
          onload() {
            loaded(window.mermaid as MermaidInstance);
          }
        },
        'mermaid'
      );
    }
  }, [
    editorExtensions.mermaid,
    editorExtensionsAttrs.mermaid,
    editorId,
    invalidateMermaid,
    props.noMermaid
  ]);

  const replaceMermaid = useCallback(async () => {
    const root = rootRef?.current;
    const instance = mermaidRef.current;
    if (disposed.current || props.noMermaid || !instance || !root) return;

    const nodes = root.querySelectorAll<HTMLElement>(
      `div.${prefix}-mermaid, p.${prefix}-mermaid[data-processed]`
    );
    await Promise.all(
      Array.from(nodes)
        .filter((item) => {
          // 策略更新后 HTML 可能尚未提交，等待当前版本的节点，避免对即将替换的节点启动渲染。
          return (
            item.dataset.closed !== 'false' &&
            item.dataset.mermaidRevision === String(reRenderRef.current) &&
            !bound.has(item)
          );
        })
        .map((item) => {
          const existing = pending.get(item);
          if (existing?.generation === generation.current) return existing.promise;

          const render = async () => {
            const version = generation.current;
            const revision = reRenderRef.current;
            const code = item.dataset.content ?? item.textContent ?? '';
            const block = item.dataset.mermaidBlock;
            const key = JSON.stringify([revision, block, code]);
            const sanitize = props.sanitizeMermaid;
            const currentTheme = theme;
            const isCurrent = () =>
              !disposed.current &&
              generation.current === version &&
              item.isConnected &&
              root.contains(item);

            if (!isCurrent()) return;

            try {
              let result = cache.get(key);
              if (result && item.dataset.processed !== undefined) {
                // Markdown renderer 可以复用当前实例的已清洗 SVG，但新生成的 DOM
                // 仍需绑定事件，不能把 data-processed 当作事件也已绑定的标记。
                result.bindFunctions?.(item);
                bound.add(item);
                return;
              }
              if (!result) {
                const rendered = await enqueueRender(instance, async () => {
                  if (!isCurrent()) return;

                  const securityDefaults = {
                    startOnLoad: false,
                    securityLevel: 'strict',
                    secure: Array.from(
                      new Set([
                        ...(instance.mermaidAPI?.defaultConfig?.secure || []),
                        'secure',
                        'securityLevel',
                        'startOnLoad',
                        'maxTextSize',
                        'suppressErrorRendering',
                        'maxEdges',
                        'dompurifyConfig'
                      ])
                    )
                  };
                  const baseConfig = {
                    ...securityDefaults,
                    ...(currentTheme === 'dark'
                      ? { theme: 'dark' }
                      : {
                          theme: 'base',
                          themeVariables: {
                            background: '#ffffff',
                            primaryColor: '#ffffff',
                            primaryTextColor: '#1f2329',
                            primaryBorderColor: '#b7c0cc',
                            secondaryColor: '#f7f8fa',
                            tertiaryColor: '#f7f8fa',
                            lineColor: '#596273',
                            edgeLabelBackground: '#ffffff',
                            clusterBkg: '#ffffff',
                            clusterBorder: '#b7c0cc'
                          }
                        })
                  };
                  const configured = mermaidConfig(baseConfig) as
                    | Record<string, unknown>
                    | undefined;
                  instance.initialize({
                    ...configured,
                    // 返回部分主题配置时仍继承安全默认值，显式覆盖则尊重调用方选择。
                    startOnLoad: configured?.startOnLoad ?? false,
                    securityLevel: configured?.securityLevel ?? 'strict',
                    secure: configured?.secure ?? securityDefaults.secure
                  });

                  const container = document.createElement('div');
                  container.style.cssText =
                    'position:fixed;z-index:-10000;top:-10000px;left:-10000px;';
                  container.style.width =
                    Math.max(document.body.offsetWidth, 1366) + 'px';
                  container.style.height =
                    Math.max(document.body.offsetHeight, 768) + 'px';
                  document.body.appendChild(container);
                  try {
                    return await instance.render(randomId(), code, container);
                  } finally {
                    container.remove();
                  }
                });
                if (!rendered || !isCurrent()) return;

                const svg = sanitize ? await sanitize(rendered.svg) : rendered.svg;
                if (!isCurrent()) return;
                if (typeof svg !== 'string') {
                  throw new TypeError('Mermaid sanitizer must return a string.');
                }
                result = { svg, bindFunctions: rendered.bindFunctions };
              }

              if (!isCurrent()) return;
              const paragraph = document.createElement('p');
              for (const attribute of Array.from(item.attributes)) {
                paragraph.setAttribute(attribute.name, attribute.value);
              }
              paragraph.setAttribute('data-processed', '');
              paragraph.setAttribute('data-content', code);
              paragraph.innerHTML = result.svg;
              paragraph.children[0]?.removeAttribute('height');
              const normalized = { ...result, svg: paragraph.innerHTML };

              item.replaceWith(paragraph);
              try {
                // 每次插入新的 DOM 都重新绑定。缓存只在同一预览的同一代码块中复用，
                // 相同源码的其他图表会获得独立 SVG id，避免回调绑定到错误的图表。
                result.bindFunctions?.(paragraph);
                bound.add(paragraph);
              } catch (error) {
                paragraph.replaceWith(item);
                throw error;
              }
              cache.set(key, normalized);
            } catch (error: any) {
              if (!isCurrent()) return;
              if (item.dataset.processed !== undefined) {
                item.textContent = code;
                item.removeAttribute('data-processed');
              }
              eventBus.emit(editorId, ERROR_CATCHER, {
                name: 'mermaid',
                message: error?.message,
                error
              });
            }
          };

          const task = render().finally(() => {
            if (pending.get(item)?.promise === task) pending.delete(item);
          });
          pending.set(item, { generation: generation.current, promise: task });
          return task;
        })
    );
  }, [
    bound,
    cache,
    editorId,
    mermaidConfig,
    pending,
    props.noMermaid,
    props.sanitizeMermaid,
    rootRef,
    theme
  ]);

  return { reRender, reRenderRef, replaceMermaid, invalidateMermaid, getCachedMermaid };
};

export default useMermaid;
