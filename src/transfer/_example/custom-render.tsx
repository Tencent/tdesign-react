import React from 'react';
import { Transfer } from 'tdesign-react';

import type { TransferProps } from 'tdesign-react';

const list: TransferProps['data'] = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    description: `第${i + 1}段信息`,
  });
}

export default function BaseExample() {
  const renderTransferItems: any = () => [
    ({ data }: { data: { label: string; description: string } }) => (
      <span className="transfer-item">
        {data.label} - {data.description}
      </span>
    ),
    ({ data, index }: { data: { label: string; description: string }; index: number }) => (
      <span className="transfer-item">
        {index} - {data.label}
      </span>
    ),
  ];
  return <Transfer data={list} transferItem={renderTransferItems}></Transfer>;
}
