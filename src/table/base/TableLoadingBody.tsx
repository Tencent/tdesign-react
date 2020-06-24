import React from 'react';
import useConfig from '../../_util/useConfig';

export const TableLoadingBody = function TableLoadingBody() {
  const { classPrefix } = useConfig();

  return (
    <div className={`${classPrefix}-table--loading`}>
      <div
        className={`${classPrefix}-table--loading-progressbar`}
        style={{ width: '50%' }}
      />
      <div className={`${classPrefix}-table--loading-message`}>
        <p>正在加载中，请稍候</p>
      </div>
    </div>
  );
};
