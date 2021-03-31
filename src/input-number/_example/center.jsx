import React, { useState } from 'react';
import { InputNumber } from '../InputNumber';

export default function InputNumberExample() {
  const [value, setValue] = useState(18.0);

  return (
    <InputNumber
      theme="row"
      size="medium"
      max={10}
      min={-1}
      defaultValue={30}
      value={value}
      onChange={(value) => {
        console.log(value);
        setValue(value);
      }}
    ></InputNumber>
  );
}
