import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <>
      <Textarea
        placeholder="normal"
        value={value}
        tips={'正常提示'}
        onChange={(value) => {
          console.log(value);
          onChange(value);
        }}
      />
      <div style={{ height: '20px' }}></div>
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
      <div style={{ height: '20px' }}></div>
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
      <div style={{ height: '20px' }}></div>
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
    </>
  );
}
