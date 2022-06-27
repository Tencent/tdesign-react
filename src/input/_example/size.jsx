import React, { useState } from 'react';
import { Input, Space } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <Space direction="vertical" style={{ width: 500 }}>
      <Input
        placeholder="请输入内容"
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
        size="large"
      />
      <Input
        placeholder="请输入内容"
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
      />
    </Space>
  );
}
