import React, { useState } from 'react';
import { Textarea, Space } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Textarea
        placeholder="normal"
        value={value}
        tips={'正常提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="success"
        placeholder="success"
        value={value}
        tips={'成功提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="warning"
        placeholder="warning"
        value={value}
        tips={'警告提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="error"
        placeholder="error"
        value={value}
        tips={'错误提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
    </Space>
  );
}
