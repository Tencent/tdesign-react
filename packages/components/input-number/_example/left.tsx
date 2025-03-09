import React from 'react';
import { InputNumber } from 'tdesign-react';

export default function InputNumberExample() {
  return <InputNumber defaultValue={5} theme="column" onChange={(v) => console.log(v)} />;
}
