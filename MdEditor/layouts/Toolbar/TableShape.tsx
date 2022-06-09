import React, { useState } from 'react';
import { prefix } from '../../config';

export interface HoverData {
  x: number;
  y: number;
}

interface TableShapeProp {
  tableShape: [number, number];
  onSelected: (data: HoverData) => void;
}

const TableShape = (props: TableShapeProp) => {
  const [hoverPosition, setHoverPosition] = useState<HoverData>({
    x: -1,
    y: -1
  });

  return (
    <div
      className={`${prefix}-table-shape`}
      onMouseLeave={() => {
        setHoverPosition({
          x: -1,
          y: -1
        });
      }}
    >
      {new Array(props.tableShape[1]).fill('').map((_, rowIndex) => (
        <div className={`${prefix}-table-shape-row`} key={`table-shape-row-${rowIndex}`}>
          {new Array(props.tableShape[0]).fill('').map((_, colIndex) => (
            <div
              className={`${prefix}-table-shape-col`}
              key={`table-shape-col-${colIndex}`}
              onMouseEnter={() => {
                setHoverPosition({
                  x: rowIndex,
                  y: colIndex
                });
              }}
              onClick={() => {
                props.onSelected(hoverPosition);
              }}
            >
              <div
                className={[
                  `${prefix}-table-shape-col-default`,
                  rowIndex <= hoverPosition.x &&
                    colIndex <= hoverPosition.y &&
                    `${prefix}-table-shape-col-include`
                ]
                  .filter((c) => !!c)
                  .join(' ')}
              ></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TableShape;
