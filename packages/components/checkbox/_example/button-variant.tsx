import React from 'react';
import { Checkbox, Space } from 'tdesign-react';

const options = [
  { value: 'view', label: '查看数据' },
  { value: 'edit', label: '编辑数据' },
  { value: 'export', label: '导出数据' },
];

export default function CheckboxButtonVariantExample() {
  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical">
        <strong>描边形态</strong>
        <Checkbox.Group theme="button" variant="outline" defaultValue={['view', 'edit']} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>填充形态（默认）</strong>
        <Checkbox.Group theme="button" variant="default-filled" defaultValue={['view', 'edit']} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>主色填充形态</strong>
        <Checkbox.Group theme="button" variant="primary-filled" defaultValue={['view', 'edit']} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>纵向排列</strong>
        <Checkbox.Group
          theme="button"
          variant="default-filled"
          direction="vertical"
          defaultValue={['view', 'edit']}
          options={options}
        />
      </Space>
    </Space>
  );
}
