import React, { useState } from 'react';
import { Input, Space } from 'tdesign-react';
import { LockOnIcon } from 'tdesign-icons-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <Space direction="vertical">
      <Input
        prefixIcon={<LockOnIcon />}
        placeholder="请输入"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
      <Input
        prefixIcon={<LockOnIcon />}
        placeholder="请输入"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
    </Space>
  );
}
