import React from 'react';
import { Input, Space } from 'tdesign-react';

export default function BorderlessInputExample() {
  return (
    <Space direction="vertical" style={{ width: 500 }}>
      <Input placeholder="please input" clearable />
      <Input placeholder="borderless input" borderless={true} clearable />
    </Space>
  );
}
