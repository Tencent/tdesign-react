import React, { useState } from 'react';
import { Radio, RadioGroup } from 'tdesign-mobile-react';

export default function () {
  const [defaultValue, setDefaultValue] = useState('1');
  const options = [
    {
      value: '1',
      label: '单选',
    },
    {
      value: '2',
      label: '单选',
    },
    {
      value: '3',
      label: '单选标题多行单选标题多行单选标题多行单选标题多行单选标题多行',
    },
  ];
  return (
    <RadioGroup className="theme-card" value={defaultValue} onChange={(value: string) => setDefaultValue(value)}>
      {options.map((opt) => (
        <Radio value={opt.value} label={opt.label} key={opt.value}></Radio>
      ))}
    </RadioGroup>
  );
}
