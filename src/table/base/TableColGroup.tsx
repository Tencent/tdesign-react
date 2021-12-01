import React from 'react';
import { BaseTableCol } from '../type';

export interface TableColGroupProps {
  columns: BaseTableCol[];
}

export const TableColGroup = ({ columns }: TableColGroupProps): any => (
  <colgroup>
    {columns.map(({ width, minWidth, colKey }, index) => (
      <col
        key={colKey || index}
        style={{
          width,
          minWidth,
        }}
      />
    ))}
  </colgroup>
);
