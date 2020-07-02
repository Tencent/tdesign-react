import React, { useState } from 'react';
import { Input } from '@tdesign/react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <>
      <Input
        placeholder="成功状态"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        status="success"
      />
      <br />
      <br />
      <Input
        placeholder="警告状态"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        status="warning"
      />
      <br />
      <br />
      <Input
        placeholder="错误状态"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        status="error"
      />
    </>
  );
}
