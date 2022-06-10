import React, { useState } from 'react';
import { Input, InputAdornment } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <InputAdornment prepend="http://">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
        />
      </InputAdornment>
      <InputAdornment prepend="http://" append=".com">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(value) => {
            onChange(value);
          }}
        />
      </InputAdornment>
    </div>
  );
}
