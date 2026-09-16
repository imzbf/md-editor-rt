import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarSup = () => {
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
      title={ult.toolbarTips?.sup}
      aria-label={ult.toolbarTips?.sup}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'sup' });
      }}
      type="button"
    >
      <Icon name="sup" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.sup}</div>
      )}
    </button>
  );
};

export default memo(ToolbarSup);
