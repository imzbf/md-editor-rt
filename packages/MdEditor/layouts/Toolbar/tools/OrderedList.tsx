import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarOrderedList = () => {
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
      title={ult.toolbarTips?.orderedList}
      aria-label={ult.toolbarTips?.orderedList}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'orderedList' });
      }}
      type="button"
    >
      <Icon name="ordered-list" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.orderedList}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarOrderedList);
