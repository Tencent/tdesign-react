import React, { useState } from 'react';
import { Checkbox, Space } from 'tdesign-react';

const options = [
  { value: 'view', label: '查看数据' },
  { value: 'edit', label: '编辑数据' },
  { value: 'export', label: '导出数据' },
  { value: 'approve', label: '允许审批' },
  { value: 'reject', label: '允许驳回' },
  { value: 'forward', label: '允许转发' },
  { value: 'delete', label: '删除数据', disabled: true },
];

export default function CheckboxButtonExample() {
  const [permissions, setPermissions] = useState(['view', 'edit']);

  return (
    <Space direction="vertical" size="large">
      <Space direction="vertical">
        <strong>使用 options 渲染</strong>
        <div>已分配权限: {permissions.length ? permissions.join('、') : '无'}</div>
        <Checkbox.Group<string[]> theme="button" value={permissions} onChange={setPermissions} options={options} />
      </Space>

      <Space direction="vertical">
        <strong>使用插槽渲染</strong>
        <Checkbox.Group theme="button" defaultValue={['Beijing']}>
          <Checkbox.Button value="Beijing">北京</Checkbox.Button>
          <Checkbox.Button value="Shanghai">上海</Checkbox.Button>
          <Checkbox.Button value="Guangzhou">广州</Checkbox.Button>
          <Checkbox.Button value="Shenzhen" disabled>
            深圳
          </Checkbox.Button>
        </Checkbox.Group>
      </Space>
    </Space>
  );
}
