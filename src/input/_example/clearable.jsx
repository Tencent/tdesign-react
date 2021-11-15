import React, { useState } from 'react';
import { Input } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('Hello TDesign');
  return (
    <div className="tdesign-demo-item--input__input-box">
      <Input
        placeholder="请输入内容"
        value={value}
        clearable
        onChange={(value) => {
          onChange(value);
        }}
        onClear={() => {
          console.log('onClear');
        }}
      />
    </div>
  );
}
