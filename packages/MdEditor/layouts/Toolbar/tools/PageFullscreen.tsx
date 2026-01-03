import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

const ToolbarPageFullscreen = () => {
  const {
    setting,
    usedLanguageText: ult,
    updateSetting,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        setting.pageFullscreen && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.pageFullscreen}
      aria-label={ult.toolbarTips?.pageFullscreen}
      disabled={disabled}
      onClick={() => {
        updateSetting('pageFullscreen');
      }}
      type="button"
    >
      <Icon name={setting.pageFullscreen ? 'minimize' : 'maximize'} />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.pageFullscreen}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarPageFullscreen);
