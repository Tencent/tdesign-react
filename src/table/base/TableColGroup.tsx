import React from 'react';
import { BaseTableCol } from '../../_type/components/table';

export interface TableColGroupProps {
  columns: BaseTableCol[];
}

export const TableColGroup = ({ columns }: TableColGroupProps): any => (
  <colgroup>
    {columns.map(({ width, minWidth, colKey }) => (
      <col
        key={colKey}
        style={{
          width,
          minWidth,
        }}
      />
    ))}
  </colgroup>
);
