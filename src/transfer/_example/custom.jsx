import React from 'react';
import { Transfer } from 'tdesign-react';

const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    disabled: i % 4 < 1,
  });
}

export default function BaseExample() {
  return (
    <Transfer
      data={list}
      title={['来源', () => <div>目标</div>]}
      operation={['加入', '移除']}
      footer={[<div style={{ padding: '10px 20px' }}>选中并加入</div>, <div style={{ padding: '10px 20px' }}>选中并移除</div>]}
    ></Transfer>
  );
}
