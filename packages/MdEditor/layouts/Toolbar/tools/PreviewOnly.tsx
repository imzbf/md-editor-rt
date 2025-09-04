import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

const ToolbarPreviewOnly = () => {
  const {
    usedLanguageText: ult,
    showToolbarName,
    disabled,
    setting,
    updateSetting
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        setting.previewOnly && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.previewOnly}
      disabled={disabled}
      onClick={() => {
        updateSetting('previewOnly');
      }}
    >
      <Icon name="preview-only" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.previewOnly}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarPreviewOnly);
