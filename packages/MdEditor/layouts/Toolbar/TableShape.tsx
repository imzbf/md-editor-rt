import React, { useCallback, useState, useEffect } from 'react';
import { prefix } from '~/config';
import { TableShapeType } from '~/type';

export interface HoverData {
  x: number;
  y: number;
}

interface TableShapeProps {
  tableShape: TableShapeType;
  onSelected: (data: HoverData) => void;
}

const TableShape = (props: TableShapeProps) => {
  const [hoverPosition, setHoverPosition] = useState<HoverData>({
    x: -1,
    y: -1
  });

  const initShape = useCallback(() => {
    const shape = [...props.tableShape];

    if (!shape[2] || shape[2] < shape[0]) {
      shape[2] = shape[0];
    }

    if (!shape[3] || shape[3] < shape[3]) {
      shape[3] = shape[1];
    }

    return shape;
  }, [props.tableShape]);

  const [tableShape, setTableShape] = useState(initShape);

  useEffect(() => {
    setTableShape(initShape);
  }, [initShape]);

  return (
    <div
      className={`${prefix}-table-shape`}
      onMouseLeave={() => {
        setTableShape(initShape);
        setHoverPosition({
          x: -1,
          y: -1
        });
      }}
    >
      {new Array(tableShape[1]).fill('').map((_, rowIndex) => (
        <div className={`${prefix}-table-shape-row`} key={`table-shape-row-${rowIndex}`}>
          {new Array(tableShape[0]).fill('').map((_, colIndex) => (
            <div
              className={`${prefix}-table-shape-col`}
              key={`table-shape-col-${colIndex}`}
              onMouseEnter={() => {
                setHoverPosition({
                  x: rowIndex,
                  y: colIndex
                });

                if (colIndex + 1 === tableShape[0] && colIndex + 1 < tableShape[2]) {
                  setTableShape((ts) => {
                    const shapeCopy = [...ts];
                    shapeCopy[0] = ts[0] + 1;
                    return shapeCopy;
                  });
                } else if (
                  colIndex + 2 < tableShape[0] &&
                  tableShape[0] > props.tableShape[0]
                ) {
                  setTableShape((ts) => {
                    const shapeCopy = [...ts];
                    shapeCopy[0] = ts[0] - 1;
                    return shapeCopy;
                  });
                }

                if (rowIndex + 1 === tableShape[1] && rowIndex + 1 < tableShape[3]) {
                  setTableShape((ts) => {
                    const shapeCopy = [...ts];
                    shapeCopy[1] = ts[1] + 1;
                    return shapeCopy;
                  });
                } else if (
                  rowIndex + 2 < tableShape[1] &&
                  tableShape[1] > props.tableShape[1]
                ) {
                  setTableShape((ts) => {
                    const shapeCopy = [...ts];
                    shapeCopy[1] = ts[1] - 1;
                    return shapeCopy;
                  });
                }
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
