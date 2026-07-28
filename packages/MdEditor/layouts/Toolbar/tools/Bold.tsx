import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarBold = () => {
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
      title={ult.toolbarTips?.bold}
      aria-label={ult.toolbarTips?.bold}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'bold' });
      }}
      type="button"
    >
      <Icon name="bold" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.bold}</div>
      )}
    </button>
  );
};

export default memo(ToolbarBold);
