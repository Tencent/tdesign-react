import React, { useState } from 'react';
import { Input, Icon } from '@tencent/tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        prefixIcon="lock-on"
        suffixIcon="prompt_fill"
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <Input
        prefixIcon={<Icon name="lock-on" />}
        suffixIcon="prompt_fill"
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </div>
  );
}
