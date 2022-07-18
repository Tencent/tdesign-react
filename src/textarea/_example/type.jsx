import React from 'react';
import { Textarea, Space } from 'tdesign-react';

export default function InputExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Textarea placeholder="请输入内容" readonly defaultValue="只读状态" />
      <Textarea placeholder="请输入内容" disabled defaultValue="禁用状态" />
    </Space>
  );
}
