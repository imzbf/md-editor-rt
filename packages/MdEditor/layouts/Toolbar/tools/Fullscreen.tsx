import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { useSreenfull } from '../hooks';

const ToolbarFullscreen = () => {
  const {
    setting,
    usedLanguageText: ult,
    showToolbarName,
    disabled
  } = useContext(EditorContext);

  // 全屏功能
  const { fullscreenHandler } = useSreenfull();

  return (
    <button
      className={classnames([
        `${prefix}-toolbar-item`,
        setting.fullscreen && `${prefix}-toolbar-active`,
        disabled && `${prefix}-disabled`
      ])}
      title={ult.toolbarTips?.fullscreen}
      disabled={disabled}
      onClick={() => {
        fullscreenHandler();
      }}
    >
      <Icon name={setting.fullscreen ? 'fullscreen-exit' : 'fullscreen'} />

      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.fullscreen}</div>
      )}
    </button>
  );
};

export default memo(ToolbarFullscreen);
