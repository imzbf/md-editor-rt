import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarImage = () => {
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
      title={ult.toolbarTips?.image}
      aria-label={ult.toolbarTips?.image}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'image' });
      }}
      type="button"
    >
      <Icon name="image" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.image}</div>
      )}
    </button>
  );
};

export default memo(ToolbarImage);
