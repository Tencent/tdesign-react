import React from 'react';
import { Select, Space } from 'tdesign-react';

function Status() {
  return (
    <Space>
      <Select
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
      ></Select>
      <Select
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
        disabled
      ></Select>
      <Select
        options={[
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
          { label: '选项3', value: '3' },
        ]}
        loading
      ></Select>
    </Space>
  );
}

export default Status;
