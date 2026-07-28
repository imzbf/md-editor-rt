import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { ToolDirective } from '~/utils/content-help';
import { emitReplace } from '~/utils/replace';

const ToolbarKatex = () => {
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
          contentDisabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.katex}
        aria-label={ult.toolbarTips?.katex}
        disabled={contentDisabled}
        type="button"
      >
        <Icon name="formula" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.katex}</div>
        )}
      </button>
    );
  }, [contentDisabled, showToolbarName, ult.toolbarTips?.katex]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={contentDisabled}
      overlay={overlay}
      key="bar-katex"
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarKatex);
