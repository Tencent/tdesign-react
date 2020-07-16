import React, { useState } from 'react';
import { Input, Addon } from '@tdesign/react';

export default function InputExample() {
  const [value, onChange] = useState('');
  return (
    <>
      <Addon prepend="http://">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
      </Addon>
      <Addon prepend="http://" append=".com">
        <Input
          placeholder="请输入域名"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
        />
      </Addon>
    </>
  );
}
