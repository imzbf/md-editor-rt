import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { CTRL_Z } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarRevoke = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([`${prefix}-toolbar-item`, disabled && `${prefix}-disabled`])}
      title={ult.toolbarTips?.revoke}
      aria-label={ult.toolbarTips?.revoke}
      disabled={disabled}
      onClick={() => {
        bus.emit(editorId, CTRL_Z);
      }}
      type="button"
    >
      <Icon name="revoke" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.revoke}</div>
      )}
    </button>
  );
};

export default memo(ToolbarRevoke);
