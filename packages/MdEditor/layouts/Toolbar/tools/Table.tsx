import { memo, useCallback, useContext, useMemo, useState } from 'react';
import TableShape, { HoverData } from '../TableShape';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { classnames } from '~/utils';
import { emitReplace } from '~/utils/replace';

const ToolbarTable = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    contentDisabled,
    tableShape
  } = useContext(EditorContext);
  const wrapperId = `${editorId}-toolbar-wrapper`;
  const [visible, setVisible] = useState(false);

  const onSelected = useCallback(
    (selectedShape: HoverData) => {
      if (contentDisabled) return;
      emitReplace(editorId, { direct: 'table', params: { selectedShape } });
    },
    [contentDisabled, editorId]
  );

  const overlay = useMemo(() => {
    return <TableShape tableShape={tableShape} onSelected={onSelected} />;
  }, [onSelected, tableShape]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          contentDisabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.table}
        aria-label={ult.toolbarTips?.table}
        disabled={contentDisabled}
        type="button"
      >
        <Icon name="table" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.table}</div>
        )}
      </button>
    );
  }, [contentDisabled, showToolbarName, ult.toolbarTips?.table]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={contentDisabled}
      key="bar-table"
      overlay={overlay}
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarTable);
