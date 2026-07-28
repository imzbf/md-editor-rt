import { memo, useContext } from 'react';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarQuote = () => {
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
      title={ult.toolbarTips?.quote}
      aria-label={ult.toolbarTips?.quote}
      disabled={contentDisabled}
      onClick={() => {
        emitReplace(editorId, { direct: 'quote' });
      }}
      type="button"
    >
      <Icon name="quote" />
      {showToolbarName && (
        <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.quote}</div>
      )}
    </button>
  );
};

export default memo(ToolbarQuote);
