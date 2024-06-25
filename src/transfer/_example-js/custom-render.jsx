import React from 'react';
import { Transfer } from 'tdesign-react';

const list = [];
for (let i = 0; i < 20; i++) {
  list.push({
    value: i.toString(),
    label: `内容${i + 1}`,
    description: `第${i + 1}段信息`,
  });
}

export default function BaseExample() {
  return (
    <Transfer
      data={list}
      transferItem={[
        ({ data }) => (
          <span className="transfer-item">
            {data.label} - {data.description}
          </span>
        ),
        ({ data, index }) => (
          <span className="transfer-item">
            {index} - {data.label}
          </span>
        ),
      ]}
    ></Transfer>
  );
}
