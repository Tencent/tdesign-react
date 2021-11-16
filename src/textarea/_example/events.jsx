import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');

  function onKeypress(value, { e }) {
    console.log('onKeypress: ', value, e);
  }
  function onKeydown(value, { e }) {
    console.log('onKeydown: ', value, e);
  }
  function onKeyup(value, { e }) {
    console.log('onKeyup: ', value, e);
  }
  function onFocus(value, { e }) {
    console.log('onFocus: ', value, e);
  }
  function onBlur(value, { e }) {
    console.log('onBlur: ', value, e);
  }

  return (
    <Textarea
      placeholder="请输入内容"
      onKeypress={onKeypress}
      onKeydown={onKeydown}
      onKeyup={onKeyup}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(value) => {
        console.log(value);
        onChange(value);
      }}
    />
  );
}
