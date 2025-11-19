import { draggingScroll } from '@vavt/util';
import { useContext, useMemo, useRef, useState, useEffect, memo } from 'react';
import { prefix } from '~/config';
import { EditorContext } from '~/context';
import { ToolbarNames } from '~/type';
import { classnames } from '~/utils';

import { useBarRender } from './hooks';

export interface ToolbarProps {
  // 工具栏选择显示
  toolbars: Array<ToolbarNames>;
  // 工具栏选择不显示
  toolbarsExclude: Array<ToolbarNames>;
}

const Toolbar = (props: ToolbarProps) => {
  const { toolbars, toolbarsExclude } = props;
  // 获取ID，语言设置
  const { editorId, showToolbarName } = useContext(EditorContext);

  const [wrapperId] = useState(() => `${editorId}-toolbar-wrapper`);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { barRender } = useBarRender();

  // 通过'='分割左右
  const splitedbar = useMemo(() => {
    const excluedBars = toolbars.filter((barItem) => !toolbarsExclude.includes(barItem));
    const moduleSplitIndex = excluedBars.indexOf('=');

    // 左侧部分
    const barLeft =
      moduleSplitIndex === -1 ? excluedBars : excluedBars.slice(0, moduleSplitIndex + 1);

    const barRight =
      moduleSplitIndex === -1
        ? []
        : excluedBars.slice(moduleSplitIndex, Number.MAX_SAFE_INTEGER);

    return [
      barLeft.map((barItem, idx) => barRender(barItem, `left-${idx}`)),
      barRight.map((barItem, idx) => barRender(barItem, `right-${idx}`))
    ];
  }, [toolbars, toolbarsExclude, barRender]);

  useEffect(() => {
    let rl = () => {};

    if (wrapperRef.current) {
      rl = draggingScroll(wrapperRef.current);
    }

    return () => {
      rl();
    };
  }, [toolbars]);

  return (
    <>
      {toolbars.length > 0 && (
        <div className={`${prefix}-toolbar-wrapper`} ref={wrapperRef} id={wrapperId}>
          <div
            className={classnames([
              `${prefix}-toolbar`,
              showToolbarName && `${prefix}-stn`
            ])}
          >
            <div className={`${prefix}-toolbar-left`}>{splitedbar[0]}</div>
            <div className={`${prefix}-toolbar-right`}>{splitedbar[1]}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Toolbar);
