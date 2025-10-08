import { memo, useCallback, useContext, useMemo, useState } from 'react';
import DropDown from '~/components/Dropdown';
import Icon from '~/components/Icon';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { REPLACE } from '~/static/event-name';
import { classnames } from '~/utils';
import bus from '~/utils/event-bus';
import TableShape, { HoverData } from '../TableShape';

const ToolbarTable = () => {
  const {
    editorId,
    usedLanguageText: ult,
    showToolbarName,
    disabled,
    tableShape
  } = useContext(EditorContext);
  const wrapperId = `${editorId}-toolbar-wrapper`;
  const [visible, setVisible] = useState(false);

  const onSelected = useCallback(
    (selectedShape: HoverData) => {
      if (disabled) return;
      bus.emit(editorId, REPLACE, 'table', { selectedShape });
    },
    [disabled, editorId]
  );

  const overlay = useMemo(() => {
    return <TableShape tableShape={tableShape} onSelected={onSelected} />;
  }, [onSelected, tableShape]);

  const child = useMemo(() => {
    return (
      <button
        className={classnames([
          `${prefix}-toolbar-item`,
          disabled && `${prefix}-disabled`
        ])}
        title={ult.toolbarTips?.table}
        disabled={disabled}
        type="button"
      >
        <Icon name="table" />
        {showToolbarName && (
          <div className={`${prefix}-toolbar-item-name`}>{ult.toolbarTips?.table}</div>
        )}
      </button>
    );
  }, [disabled, showToolbarName, ult.toolbarTips?.table]);

  return (
    <DropDown
      relative={`#${wrapperId}`}
      visible={visible}
      onChange={setVisible}
      disabled={disabled}
      key="bar-table"
      overlay={overlay}
    >
      {child}
    </DropDown>
  );
};

export default memo(ToolbarTable);
