import React from 'react';

export default function TableFooter(props) {
  const { colspan = 12, children } = props;

  return (
    <tfoot>
      <tr>
        <td colSpan={colspan}>{children}</td>
      </tr>
    </tfoot>
  );
}
