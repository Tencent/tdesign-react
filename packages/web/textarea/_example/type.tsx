import React from 'react';
import { Textarea, Space } from 'tdesign-react';

export default function InputExample() {
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Textarea placeholder="请输入内容" readonly value="只读状态" />
      <Textarea placeholder="请输入内容" disabled value="禁用状态" />

      <Textarea placeholder="normal" value={'普通状态'} tips={'正常提示'} />
      <Textarea status="success" placeholder="success" value={'成功状态'} tips={'成功提示'} />
      <Textarea status="warning" placeholder="warning" value={'警告状态'} tips={'警告提示'} />
      <Textarea status="error" placeholder="error" value={'错误状态'} tips={'错误提示'} />
    </Space>
  );
}
