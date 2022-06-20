import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <div className="tdesign-demo-block-row">
      <Textarea
        placeholder="normal"
        value={value}
        tips={'正常提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="success"
        placeholder="success"
        value={value}
        tips={'成功提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="warning"
        placeholder="warning"
        value={value}
        tips={'警告提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <Textarea
        status="error"
        placeholder="error"
        value={value}
        tips={'错误提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
    </div>
  );
}
