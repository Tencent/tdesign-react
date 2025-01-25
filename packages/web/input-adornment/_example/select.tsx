import React from 'react';
import { Select, Input, InputAdornment, Space } from 'tdesign-react';

export default function BaseExample() {
  const protocolSelect = (
    <Select
      autoWidth
      options={['http://', 'https://'].map((value) => ({ label: value, value }))}
      defaultValue="http://"
    />
  );

  const tldSelect = (
    <Select
      autoWidth
      options={['.com', '.cn', '.net', '.org'].map((value) => ({ label: value, value }))}
      defaultValue=".cn"
    />
  );

  return (
    <Space direction="vertical" className="adornment-select">
      <InputAdornment prepend={protocolSelect}>
        <Input />
      </InputAdornment>

      <InputAdornment append={tldSelect}>
        <Input />
      </InputAdornment>

      <InputAdornment prepend={protocolSelect} append={tldSelect}>
        <Select
          options={['tencent', 'qq', 'cloud.tencent'].map((value) => ({ label: value, value }))}
          defaultValue="tencent"
        />
      </InputAdornment>
    </Space>
  );
}
