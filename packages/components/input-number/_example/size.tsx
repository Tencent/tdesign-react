import React from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  return (
    <Space>
      <Space direction="vertical">
        <InputNumber size="small" max={15} min={-12} defaultValue={3} />
        <InputNumber max={15} min={-12} defaultValue={6} />
        <InputNumber size="large" max={15} min={-12} defaultValue={9} />
      </Space>

      <Space direction="vertical">
        <InputNumber defaultValue={5} size="small" theme="column" onChange={console.log} />
        <InputNumber defaultValue={5} theme="column" onChange={console.log} />
        <InputNumber defaultValue={10} size="large" theme="column" onChange={console.log} />
      </Space>

      <Space direction="vertical">
        <InputNumber defaultValue={5} size="small" theme="normal" onChange={console.log} />
        <InputNumber defaultValue={5} theme="normal" onChange={console.log} />
        <InputNumber defaultValue={10} size="large" theme="normal" onChange={console.log} />
      </Space>
    </Space>
  );
}
