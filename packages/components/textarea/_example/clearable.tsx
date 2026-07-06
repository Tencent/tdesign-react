import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function TextareaClearable() {
  const [value, setValue] = useState('这是一段可以被快速清空的多行文本。');

  return (
    <Textarea
      value={value}
      clearable
      placeholder="请输入内容"
      onChange={(value) => {
        setValue(value);
      }}
      onClear={() => {
        console.log('onClear');
      }}
    />
  );
}
