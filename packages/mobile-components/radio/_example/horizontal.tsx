import React, { useState } from 'react';
import { Radio, RadioGroup } from 'tdesign-mobile-react';

export default function Base() {
  const [defaultValue, setDefaultValue] = useState('idx0');
  return (
    <RadioGroup
      value={defaultValue}
      className="box horizontal"
      direction="horizontal"
      onChange={(value: string) => setDefaultValue(value)}
    >
      <Radio label="单选标题" value="idx0"></Radio>
      <Radio label="单选标题" value="idx1"></Radio>
      <Radio label="上限四字" value="idx2"></Radio>
    </RadioGroup>
  );
}
