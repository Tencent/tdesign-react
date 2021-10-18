import React, { useState } from 'react';
import { Input } from '@tencent/tdesign-react';
import { LockOnIcon, ErrorCircleFilledIcon } from '@tencent/tdesign-icons-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        prefixIcon={<LockOnIcon />}
        suffixIcon={<ErrorCircleFilledIcon />}
        placeholder="请输入内容"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
      <Input
        prefixIcon={<LockOnIcon />}
        suffixIcon={<ErrorCircleFilledIcon />}
        placeholder="请输入内容"
        value={value}
        type="password"
        onChange={(value) => {
          onChange(value);
        }}
      />
    </div>
  );
}
