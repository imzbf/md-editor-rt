import { StateEffect, StateField } from '@codemirror/state';
import { EditorView, showTooltip, Tooltip } from '@codemirror/view';
import { createContext, useContext, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { prefix } from '~/config';
import { defaultContextValue } from '~/context';
import Toolbar from '~/layouts/FloatingToolbar';
import { ContextType } from '~/type';

export interface FloatingToolbarContextValue<T = unknown> {
  getValue: () => T;
  subscribe: (callback: () => void) => () => void;
}

export const FloatingToolbarContext = createContext<
  FloatingToolbarContextValue<ContextType>
>({
  getValue: () => defaultContextValue,
  subscribe: () => () => {}
});

export const useFloatingToolbarValue = () => {
  const ctx = useContext(FloatingToolbarContext);

  return useSyncExternalStore(ctx.subscribe, ctx.getValue);
};

const tooltipEffect = StateEffect.define<Tooltip | null>();

const tooltipField = StateField.define<Tooltip | null>({
  create() {
    return null;
  },
  update(value, tr) {
    for (const e of tr.effects) if (e.is(tooltipEffect)) value = e.value;
    return value;
  },
  provide: (f) => showTooltip.from(f)
});

export const createFloatingToolbar = (options: {
  contextValue: FloatingToolbarContextValue<ContextType>;
}) => {
  type TooltipState = { kind: 'selection' | 'emptyLine'; pos: number };

  let lastTooltip: TooltipState | null = null;

  const showTooltip = (view: EditorView, nextState: TooltipState) => {
    if (
      lastTooltip &&
      lastTooltip.kind === nextState.kind &&
      lastTooltip.pos === nextState.pos
    ) {
      return;
    }

    lastTooltip = nextState;

    view.dispatch({
      effects: tooltipEffect.of({
        pos: nextState.pos,
        above: true,
        arrow: true,
        create: () => {
          const dom = document.createElement('div');
          const tooltipClass = `${prefix}-floating-toolbar-container`;

          dom.classList.add(tooltipClass);
          dom.dataset.state = 'hidden';

          requestAnimationFrame(() => {
            dom.dataset.state = 'visible';
          });

          // 这里需要创建一个 react 根节点
          // 如果直接使用dom，每次react更新都会重置dom中codemirror添加的节点，比如箭头
          const appNode = document.createElement('div');
          dom.appendChild(appNode);

          const root = createRoot(appNode);

          root.render(
            <FloatingToolbarContext.Provider value={options.contextValue}>
              <Toolbar />
            </FloatingToolbarContext.Provider>
          );

          return { dom, destroy: () => root.unmount() };
        }
      })
    });
  };

  const hideTooltip = (view: EditorView) => {
    if (!lastTooltip) return;

    lastTooltip = null;
    view.dispatch({ effects: tooltipEffect.of(null) });
  };

  const selectionAndEmptyLineTooltip = EditorView.updateListener.of((update) => {
    if (update.selectionSet || update.docChanged) {
      const state = update.state;
      const sel = state.selection.main;

      if (!sel.empty) {
        // 选中文字 → 显示
        showTooltip(update.view, { kind: 'selection', pos: sel.anchor });
      } else {
        // 光标位置 → 判断是不是空白行
        const pos = sel.head;
        const line = state.doc.lineAt(pos);
        if (/^\s*$/.test(line.text)) {
          showTooltip(update.view, { kind: 'emptyLine', pos });
        } else {
          hideTooltip(update.view);
        }
      }
    }
  });

  return [tooltipField, selectionAndEmptyLineTooltip];
};
