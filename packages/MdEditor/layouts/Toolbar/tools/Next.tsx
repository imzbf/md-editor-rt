import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { CTRL_SHIFT_Z } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarNext = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    contentDisabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        contentDisabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.next}
      aria-label={ult.toolbarTips?.next}
      disabled={contentDisabled}
      onClick={() => {
        bus.emit(editorId, CTRL_SHIFT_Z);
      }}
      type="button"
    >
      <Icon name="next" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.next}</div>
      )}
    </button>
  );
};

export default memo(ToolbarNext);
