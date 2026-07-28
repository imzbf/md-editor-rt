import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarPrettier = () => {
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
      title={ult.toolbarTips?.prettier}
      aria-label={ult.toolbarTips?.prettier}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'prettier' });
      }}
      type="button"
    >
      <Icon name="prettier" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.prettier}</div>
      )}
    </button>
  );
};

export default memo(ToolbarPrettier);
