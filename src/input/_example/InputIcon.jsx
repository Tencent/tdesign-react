import React, { useState } from 'react';
import { Input } from '@tdesign/react';

const PrefixIcon = () => 'icon';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <>
      <Input
        prefixIcon="search"
        suffixIcon="prompt-fill"
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
      <br />
      <br />
      <Input
        prefixIcon={PrefixIcon}
        suffixIcon="prompt-fill"
        placeholder="请输入内容"
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
      />
    </>
  );
}
