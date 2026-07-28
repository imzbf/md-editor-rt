import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarUnderline = () => {
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
      title={ult.toolbarTips?.underline}
      aria-label={ult.toolbarTips?.underline}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'underline' });
      }}
      type="button"
    >
      <Icon name="underline" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.underline}</div>
      )}
    </button>
  );
};

export default memo(ToolbarUnderline);
