import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { useFloatingToolbarValue } from '~/layouts/Content/codemirror/floatingToolbar';
import { useBarRender } from '~/layouts/Toolbar/hooks';
import { ToolbarNames } from '~/type';

const FloatingToolbar = () => {
  const contextValue = useFloatingToolbarValue();
  const { barRender } = useBarRender();

  return (
    <EditorContext.Provider value={contextValue}>
      <div className={`${prefix}-floating-toolbar`}>
        {contextValue.floatingToolbars.map((barItem: ToolbarNames) => {
          return barRender(barItem);
        })}
      </div>
    </EditorContext.Provider>
  );
};

export default FloatingToolbar;
