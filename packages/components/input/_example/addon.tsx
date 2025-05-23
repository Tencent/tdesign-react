import React, { useState } from 'react';
import { Input, InputAdornment, Space } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <Space direction="vertical">
      <InputAdornment prepend="http://">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
        />
      </InputAdornment>
      <InputAdornment prepend="http://" append=".com">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
        />
      </InputAdornment>
    </Space>
  );
}
