import React, { useState } from 'react';
import { Input } from 'tdesign-react';
import { LockOnIcon } from 'tdesign-icons-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        prefixIcon={<LockOnIcon />}
        placeholder="请输入"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
      <Input
        prefixIcon={<LockOnIcon />}
        placeholder="请输入"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
    </div>
  );
}
