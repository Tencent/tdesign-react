import React from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  return (
    <Space>
      <Space direction="vertical">
        <InputNumber align="left" defaultValue={100} />
        <InputNumber align="center" defaultValue={200} />
        <InputNumber align="right" defaultValue={300} />
      </Space>

      <Space direction="vertical">
        <InputNumber align="left" theme="normal" defaultValue={100} />
        <InputNumber align="center" theme="normal" defaultValue={200} />
        <InputNumber align="right" theme="normal" defaultValue={300} />
      </Space>
    </Space>
  );
}
