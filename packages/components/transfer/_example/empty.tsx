import React from 'react';
import { Transfer } from 'tdesign-react';

export default function BaseExample() {
  return (
    <div className="tdesign-demo-block-column">
      <p>默认暂无数据</p>
      <Transfer></Transfer>
      <p>自定义暂无数据</p>
      <Transfer
        empty={[
          'No Source',
          <div key="empty" className="t-transfer__empty">
            No Target
          </div>,
        ]}
      ></Transfer>
    </div>
  );
}
