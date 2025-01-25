import React from 'react';
import { Input, TagInput, InputAdornment, Space } from 'tdesign-react';

export default function BaseExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <InputAdornment prepend="http://">
        <Input />
      </InputAdornment>

      <InputAdornment append=".com">
        <TagInput />
      </InputAdornment>

      <InputAdornment prepend="http://" append=".com">
        <Input />
      </InputAdornment>
    </Space>
  );
}
