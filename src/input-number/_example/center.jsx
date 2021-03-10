import React, { useState } from 'react';
import { InputNumber } from '../InputNumber';

export default function InputNumberExample() {
  const [value, setValue] = useState(0);

  return (
    <InputNumber
      mode="row"
      size="medium"
      max={10}
      min={-1}
      value={value}
      onChange={(value) => {
        console.log(value);
        setValue(value);
      }}
    ></InputNumber>
  );
}
