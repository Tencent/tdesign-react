import React from 'react';
import { InputNumber } from '../InputNumber';

export default function InputNumberExample() {
  return <InputNumber theme="column" size="medium" onChange={console.log} formatter={(value) => value + '%'} />;
}
