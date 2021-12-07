import React from 'react';
import useConfig from '../../_util/useConfig';

export default function TableEmptyBody(props) {
  const { classPrefix } = useConfig();
  const { empty = '暂无数据' } = props;

  return (
    <div className={`${classPrefix}-table--empty`} style={{ borderBottom: 0 }}>
      {typeof empty === 'function' ? empty() : empty}
    </div>
  );
}
