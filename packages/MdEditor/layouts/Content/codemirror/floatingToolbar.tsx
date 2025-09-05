import { StateEffect, StateField } from '@codemirror/state';
import { EditorView, showTooltip, Tooltip } from '@codemirror/view';
import { createContext, useContext, useSyncExternalStore } from 'react';
import ReactDOM from 'react-dom/client';
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

export const createFloatingToolbarPlugin = (options: {
  contextValue: FloatingToolbarContextValue<ContextType>;
}) => {
  const showTooltip = (view: EditorView, pos: number) => {
    view.dispatch({
      effects: tooltipEffect.of({
        pos,
        above: true,
        arrow: true,
        create: () => {
          const dom = document.createElement('div');
          const root = ReactDOM.createRoot(dom);

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

  const selectionAndEmptyLineTooltip = EditorView.updateListener.of((update) => {
    if (update.selectionSet || update.docChanged) {
      const state = update.state;
      const sel = state.selection.main;

      if (!sel.empty) {
        // 选中文字 → 显示
        showTooltip(update.view, sel.from);
      } else {
        // 光标位置 → 判断是不是空白行
        const pos = sel.head;
        const line = state.doc.lineAt(pos);
        if (/^\s*$/.test(line.text)) {
          showTooltip(update.view, pos);
        } else {
          update.view.dispatch({ effects: tooltipEffect.of(null) });
        }
      }
    }
  });

  return [tooltipField, selectionAndEmptyLineTooltip];
};
