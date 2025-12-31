import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarSub = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([`${prefix}-toolbar-item`, disabled && `${prefix}-disabled`])}
      title={ult.toolbarTips?.sub}
      aria-label={ult.toolbarTips?.sub}
      disabled={disabled}
      onClick={() => {
        bus.emit(editorId, REPLACE, 'sub');
      }}
      type="button"
    >
      <Icon name="sub" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.sub}</div>
      )}
    </button>
  );
};

export default memo(ToolbarSub);
