import React, { useState } from 'react';
import { Input, SearchIcon, ErrorCircleFilledIcon } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        prefixIcon={<SearchIcon />}
        suffixIcon={<ErrorCircleFilledIcon />}
        placeholder="请输入内容"
        value={value}
        onChange={(value) => {
          onChange(value);
        }}
      />
    </div>
  );
}
