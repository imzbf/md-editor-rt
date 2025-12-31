import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarQuote = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([`${prefix}-toolbar-item`, disabled && `${prefix}-disabled`])}
      title={ult.toolbarTips?.quote}
      aria-label={ult.toolbarTips?.quote}
      disabled={disabled}
      onClick={() => {
        bus.emit(editorId, REPLACE, 'quote');
      }}
      type="button"
    >
      <Icon name="quote" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.quote}</div>
      )}
    </button>
  );
};

export default memo(ToolbarQuote);
