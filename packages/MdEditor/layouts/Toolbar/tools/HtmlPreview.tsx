import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

const ToolbarHtmlPreview = () => {
  const {
    usedLanguageText: ult,
    setting,
    updateSetting,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        setting.htmlPreview && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.htmlPreview}
      disabled={disabled}
      onClick={() => {
        updateSetting('htmlPreview');
      }}
    >
      <Icon name="preview-html" />

      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.htmlPreview}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarHtmlPreview);
