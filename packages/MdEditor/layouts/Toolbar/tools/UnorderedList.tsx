import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarUnorderedList = () => {
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
      title={ult.toolbarTips?.unorderedList}
      aria-label={ult.toolbarTips?.unorderedList}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'unorderedList' });
      }}
      type="button"
    >
      <Icon name="unordered-list" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>
          {ult.toolbarTips?.unorderedList}
        </div>
      )}
    </button>
  );
};

export default memo(ToolbarUnorderedList);
