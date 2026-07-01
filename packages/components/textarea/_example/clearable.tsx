import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function TextareaExample() {
  const [value, setValue] = useState('Hello TDesign');
  return (
    <Textarea
      placeholder="请输入内容"
      value={value}
      clearable
      onChange={(value) => {
        setValue(value);
      }}
      onClear={() => {
        console.log('onClear');
      }}
    />
  );
}
