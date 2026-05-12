import React from 'react';
import { Input, InputAdornment, Space, TagInput } from 'tdesign-react';

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
