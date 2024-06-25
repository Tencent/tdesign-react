import React from 'react';
import { Textarea, Space } from 'tdesign-react';

export default function InputExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Textarea placeholder="请输入内容" readonly value="只读状态" />
      <Textarea placeholder="请输入内容" disabled value="禁用状态" />
    </Space>
  );
}
