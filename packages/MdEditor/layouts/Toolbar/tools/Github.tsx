import { linkTo } from '@vavt/util';
import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';

const ToolbarGithub = () => {
  const { usedLanguageText: ult, showToolbarName, disabled } = useContext(EditorContext);

  return (
    <button
      className={classnames([`${prefix}-toolbar-item`, disabled && `${prefix}-disabled`])}
      title={ult.toolbarTips?.github}
      disabled={disabled}
      onClick={() => {
        linkTo('https://github.com/imzbf/md-editor-v3');
      }}
    >
      <Icon name="github" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.github}</div>
      )}
    </button>
  );
};

export default memo(ToolbarGithub);
