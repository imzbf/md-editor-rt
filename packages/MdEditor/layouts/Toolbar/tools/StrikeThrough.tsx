import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarStrikeThrough = () => {
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
      title={ult.toolbarTips?.strikeThrough}
      aria-label={ult.toolbarTips?.strikeThrough}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'strikeThrough' });
      }}
      type="button"
    >
      <Icon name="strike-through" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.strikeThrough}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarStrikeThrough);
