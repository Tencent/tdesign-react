import React from 'react';
import { InputNumber } from '@tencent/tdesign-react';

export default function InputNumberExample() {
  return <InputNumber theme="column" size="medium" onChange={console.log} />;
}
