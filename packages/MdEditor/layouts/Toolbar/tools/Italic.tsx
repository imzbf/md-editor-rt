import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarItalic = () => {
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
      title={ult.toolbarTips?.italic}
      aria-label={ult.toolbarTips?.italic}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'italic' });
      }}
      type="button"
    >
      <Icon name="italic" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.italic}</div>
      )}
    </button>
  );
};

export default memo(ToolbarItalic);
