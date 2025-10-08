import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

const ToolbarPreview = () => {
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
        setting.preview && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.preview}
      disabled={disabled}
      onClick={() => {
        updateSetting('preview');
      }}
      type="button"
    >
      <Icon name="preview" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.preview}</div>
      )}
    </button>
  );
};

export default memo(ToolbarPreview);
