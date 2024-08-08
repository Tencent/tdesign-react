import React, { useState } from 'react';
import { Textarea } from 'tdesign-react';
import type { TextareaProps } from 'tdesign-react';

export default function InputExample() {
  const [value, onChange] = useState('');

  const onKeypress: TextareaProps['onKeypress'] = (value, { e }) => {
    console.log('onKeypress: ', value, e);
  };
  const onKeydown: TextareaProps['onKeydown'] = (value, { e }) => {
    console.log('onKeydown: ', value, e);
  };
  const onKeyup: TextareaProps['onKeyup'] = (value, { e }) => {
    console.log('onKeyup: ', value, e);
  };
  const onFocus: TextareaProps['onFocus'] = (value, { e }) => {
    console.log('onFocus: ', value, e);
  };
  const onBlur: TextareaProps['onBlur'] = (value, { e }) => {
    console.log('onBlur: ', value, e);
  };

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
