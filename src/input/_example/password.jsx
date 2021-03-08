import React, { useState } from 'react';
import { Input, LockOnIcon, ErrorCircleFilledIcon } from '@tencent/tdesign-react';

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
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <Input
        prefixIcon={<LockOnIcon />}
        suffixIcon={<ErrorCircleFilledIcon />}
        placeholder="请输入内容"
        value={value}
        type="password"
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
