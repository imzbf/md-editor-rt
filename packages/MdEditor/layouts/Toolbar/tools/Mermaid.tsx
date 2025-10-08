import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import bus from '~/utils/event-bus';

const ToolbarMermaid = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);
  const wrapperId = `${editorId}-toolbar-wrapper`;
  const [visible, setVisible] = useState(false);

  const emitHandler = useCallback(
    (direct: ToolDirective) => {
      if (disabled) return;

      bus.emit(editorId, REPLACE, direct);
    },
    [disabled, editorId]
  );

  const overlay = useMemo(() => {
    return (
      <ul
        className={`${prefix}-menu`}
        onClick={() => {
          setVisible(false);
        }}
        role="menu"
      >
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('flow');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.flow}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('sequence');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.sequence}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('gantt');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.gantt}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('class');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.class}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('state');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.state}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('pie');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.pie}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('relationship');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.relationship}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-mermaid`}
          onClick={() => {
            emitHandler('journey');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.mermaid?.journey}
        </li>
      </ul>
    );
  }, [
    emitHandler,
    ult.mermaid?.class,
    ult.mermaid?.flow,
    ult.mermaid?.gantt,
    ult.mermaid?.journey,
    ult.mermaid?.pie,
    ult.mermaid?.relationship,
    ult.mermaid?.sequence,
    ult.mermaid?.state
  ]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          disabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.mermaid}
        disabled={disabled}
        type="button"
      >
        <Icon name="mermaid" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.mermaid}</div>
        )}
      </button>
    );
  }, [disabled, showToolbarName, ult.toolbarTips?.mermaid]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={disabled}
      overlay={overlay}
      key="bar-mermaid"
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarMermaid);
