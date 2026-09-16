import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import { emitReplace } from '~/utils/replace';

const ToolbarMermaid = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    contentDisabled
  } = useContext(EditorContext);
  const wrapperId = `${editorId}-toolbar-wrapper`;
  const [visible, setVisible] = useState(false);

  const emitHandler = useCallback(
    (direct: ToolDirective) => {
      if (contentDisabled) return;

      emitReplace(editorId, { direct });
    },
    [contentDisabled, editorId]
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
          contentDisabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.mermaid}
        aria-label={ult.toolbarTips?.mermaid}
        disabled={contentDisabled}
        type="button"
      >
        <Icon name="mermaid" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.mermaid}</div>
        )}
      </button>
    );
  }, [contentDisabled, showToolbarName, ult.toolbarTips?.mermaid]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={contentDisabled}
      overlay={overlay}
      key="bar-mermaid"
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarMermaid);
