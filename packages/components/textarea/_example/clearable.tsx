import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function TextareaClearableExample() {
  const [value, setValue] = useState('Hello TDesign');

  return (
    <Textarea
      value={value}
      clearable
      placeholder="请输入"
      style={{ width: '100%', maxWidth: 500 }}
      onChange={(value) => {
        setValue(value);
      }}
      onClear={() => {
        console.log('onClear');
      }}
    />
  );
}
