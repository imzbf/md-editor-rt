import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import bus from '~/utils/event-bus';

const ToolbarKatex = () => {
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
          className={`${prefix}-menu-item ${prefix}-menu-item-katex`}
          onClick={() => {
            emitHandler('katexInline');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.katex?.inline}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-katex`}
          onClick={() => {
            emitHandler('katexBlock');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.katex?.block}
        </li>
      </ul>
    );
  }, [emitHandler, ult.katex?.block, ult.katex?.inline]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          disabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.katex}
        aria-label={ult.toolbarTips?.katex}
        disabled={disabled}
        type="button"
      >
        <Icon name="formula" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.katex}</div>
        )}
      </button>
    );
  }, [disabled, showToolbarName, ult.toolbarTips?.katex]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={disabled}
      overlay={overlay}
      key="bar-katex"
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarKatex);
