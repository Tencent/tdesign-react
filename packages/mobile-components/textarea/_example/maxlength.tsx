import React, { useState } from 'react';
import { Textarea } from 'tdesign-mobile-react';
import type { TextareaProps } from 'tdesign-mobile-react';

export default function Maxlength() {
  const [value, onChange] = useState<TextareaProps['value']>('');
  return (
    <Textarea
      style={{ height: '132px' }}
      placeholder="设置最大字符个数"
      label="标签文字"
      maxlength={100}
      allowInputOverMax
      indicator
      value={value}
      onChange={(value) => {
        console.log(value);
        onChange(value);
      }}
    />
  );
}
