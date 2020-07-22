import React from 'react';
import { TableColumn } from '../TableProps';

export interface TableColGroupProps {
  columns: TableColumn[];
}

export const TableColGroup = ({ columns }: TableColGroupProps): any => (
  <colgroup>
    {columns.map(({ key, width, minWidth, className }) => (
      <col
        key={key}
        style={{
          width: typeof width === 'undefined' ? 'auto' : width,
          minWidth: typeof minWidth === 'undefined' ? 'auto' : minWidth,
        }}
        className={className}
      />
    ))}
  </colgroup>
);
