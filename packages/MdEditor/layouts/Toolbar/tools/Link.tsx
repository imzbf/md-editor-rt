import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarLink = () => {
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
      title={ult.toolbarTips?.link}
      aria-label={ult.toolbarTips?.link}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'link' });
      }}
      type="button"
    >
      <Icon name="link" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.link}</div>
      )}
    </button>
  );
};

export default memo(ToolbarLink);
