import React, { useState } from 'react';
import { Input } from '@tdesign/react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <Input
      placeholder="请输入内容"
      value={value}
      onChange={(event) => {
        onChange(event.target.value);
      }}
    />
  );
}
