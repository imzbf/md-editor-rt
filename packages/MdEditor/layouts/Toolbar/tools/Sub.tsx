import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarSub = () => {
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
      title={ult.toolbarTips?.sub}
      aria-label={ult.toolbarTips?.sub}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'sub' });
      }}
      type="button"
    >
      <Icon name="sub" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.sub}</div>
      )}
    </button>
  );
};

export default memo(ToolbarSub);
