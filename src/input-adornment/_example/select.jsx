import React, { useEffect } from 'react';
import { Select, Input, InputAdornment, Space } from 'tdesign-react';

const classStyles = `
  <style>
    .adornment-select {
      width: 100%;
    }
    .adornment-select .t-input-adornment .t-input-adornment__prepend,
    .adornment-select .t-input-adornment .t-input-adornment__append {
      transition: background-color 0.3s;
    }
    .adornment-select .t-input-adornment .t-input-adornment__prepend:hover,
    .adornment-select .t-input-adornment .t-input-adornment__append:hover {
      background-color: var(--td-bg-color-secondarycontainer-hover);
    }
    .adornment-select .t-input-adornment .t-input-adornment__prepend .t-select__wrap .t-select .t-input:hover:not(.t-is-disabled) .t-fake-arrow,
    .adornment-select .t-input-adornment .t-input-adornment__append .t-select__wrap .t-select .t-input:hover:not(.t-is-disabled) .t-fake-arrow {
      color: var(--td-text-color-placeholder);
    }
  </style>
`;

export default function BaseExample() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const protocolSelect = (
    <Select
      borderless
      autoWidth
      options={['http://', 'https://'].map((value) => ({ label: value, value }))}
      defaultValue="http://"
    />
  );

  const tldSelect = (
    <Select
      borderless
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
