import React, { useState } from 'react';
import { Input } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        placeholder="请输入内容"
        value={value}
        type="search"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
