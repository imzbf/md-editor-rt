import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { CHANGE_CATALOG_VISIBLE } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';

const ToolbarCatalog = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled,
    catalogVisible
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        catalogVisible && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.catalog}
      aria-label={ult.toolbarTips?.catalog}
      disabled={disabled}
      onClick={() => {
        bus.emit(editorId, CHANGE_CATALOG_VISIBLE);
      }}
      key="bar-catalog"
      type="button"
    >
      <Icon name="catalog" />

      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.catalog}</div>
      )}
    </button>
  );
};

export default memo(ToolbarCatalog);
