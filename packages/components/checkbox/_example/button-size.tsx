import React from 'react';
import { Checkbox, Space } from 'tdesign-react';

const options = [
  { value: 'view', label: '查看数据' },
  { value: 'edit', label: '编辑数据' },
  { value: 'export', label: '导出数据' },
];

export default function CheckboxButtonSizeExample() {
  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical">
        <strong>大尺寸</strong>
        <Checkbox.Group theme="button" size="large" defaultValue={['view']} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>中尺寸（默认）</strong>
        <Checkbox.Group theme="button" size="medium" defaultValue={['view']} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>小尺寸</strong>
        <Checkbox.Group theme="button" size="small" defaultValue={['view']} options={options} />
      </Space>
    </Space>
  );
}
