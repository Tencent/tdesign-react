import React from 'react';
import { useTableContext } from './TableContext';

export default function TableFooter(props) {
  const { children } = props;
  const { flattenColumns } = useTableContext();

  return (
    <tfoot>
      <tr>
        <td colSpan={flattenColumns.length}>{children}</td>
      </tr>
    </tfoot>
  );
}
