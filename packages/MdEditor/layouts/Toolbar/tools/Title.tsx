import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import bus from '~/utils/event-bus';

const ToolbarTitle = () => {
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
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h1');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h1}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h2');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h2}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h3');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h3}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h4');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h4}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h5');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h5}
        </li>
        <li
          className={`${prefix}-menu-item ${prefix}-menu-item-title`}
          onClick={() => {
            emitHandler('h6');
          }}
          role="menuitem"
          tabIndex={0}
        >
          {ult.titleItem?.h6}
        </li>
      </ul>
    );
  }, [
    emitHandler,
    ult.titleItem?.h1,
    ult.titleItem?.h2,
    ult.titleItem?.h3,
    ult.titleItem?.h4,
    ult.titleItem?.h5,
    ult.titleItem?.h6
  ]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          disabled && `${prefix}-disabled`
        ])}
        disabled={disabled}
        title={ult.toolbarTips?.title}
      >
        <Icon name="title" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.title}</div>
        )}
      </button>
    );
  }, [disabled, showToolbarName, ult.toolbarTips?.title]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={disabled}
      overlay={overlay}
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarTitle);
