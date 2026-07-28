import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarCodeRow = () => {
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
      title={ult.toolbarTips?.codeRow}
      aria-label={ult.toolbarTips?.codeRow}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'codeRow' });
      }}
      type="button"
    >
      <Icon name="code-row" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.codeRow}</div>
      )}
    </button>
  );
};

export default memo(ToolbarCodeRow);
