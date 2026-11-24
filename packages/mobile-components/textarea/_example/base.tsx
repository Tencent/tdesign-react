import React, { useState } from 'react';
import { Textarea } from 'tdesign-mobile-react';
import type { TextareaProps } from 'tdesign-mobile-react';

export default function Base() {
  const [value, onChange] = useState<TextareaProps['value']>('');

  function onFocus(value, { e }) {
    console.log('onFocus: ', value, e);
  }
  function onBlur(value, { e }) {
    console.log('onBlur: ', value, e);
  }

  return (
    <Textarea
      className="textarea-example"
      value={value}
      placeholder="请输入文字"
      onFocus={onFocus}
      onBlur={onBlur}
      onChange={(value) => {
        console.log('value', value);
        onChange(value);
      }}
    />
  );
}
