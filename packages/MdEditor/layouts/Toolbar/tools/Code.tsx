import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarCode = () => {
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
      title={ult.toolbarTips?.code}
      aria-label={ult.toolbarTips?.code}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'code' });
      }}
      type="button"
    >
      <Icon name="code" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.code}</div>
      )}
    </button>
  );
};

export default memo(ToolbarCode);
