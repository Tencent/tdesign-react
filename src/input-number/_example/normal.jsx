import React from 'react';
import { InputNumber } from 'tdesign-react';

export default function InputNumberExample() {
  return <InputNumber theme="normal" defaultValue={10} onChange={console.log} />;
}
