import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarStrikeThrough = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([`${prefix}-toolbar-item`, disabled && `${prefix}-disabled`])}
      title={ult.toolbarTips?.strikeThrough}
      disabled={disabled}
      onClick={() => {
        bus.emit(editorId, REPLACE, 'strikeThrough');
      }}
      type="button"
    >
      <Icon name="strike-through" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.strikeThrough}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarStrikeThrough);
