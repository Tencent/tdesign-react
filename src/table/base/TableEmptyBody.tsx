import React from 'react';
import useConfig from '../../_util/useConfig';

export default function TableEmptyBody(props) {
  const { classPrefix, locale } = useConfig();
  const { empty = locale.table.empty } = props;

  return (
    <div className={`${classPrefix}-table__empty`} style={{ borderBottom: 0 }}>
      {typeof empty === 'function' ? empty() : empty}
    </div>
  );
}
