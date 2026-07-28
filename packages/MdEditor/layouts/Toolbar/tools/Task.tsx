import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarTask = () => {
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
      title={ult.toolbarTips?.task}
      aria-label={ult.toolbarTips?.task}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'task' });
      }}
      type="button"
    >
      <Icon name="task" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.task}</div>
      )}
    </button>
  );
};

export default memo(ToolbarTask);
