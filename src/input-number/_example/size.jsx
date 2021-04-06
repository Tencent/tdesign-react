import React, { useState } from 'react';
import { InputNumber } from '../InputNumber';

export default function InputNumberExample() {
  const [value, setValue] = useState(0);

  return (
    <>
      <InputNumber
        size="small"
        max={15}
        min={-12}
        value={value}
        onChange={(value) => {
          console.log(value);
          setValue(value);
        }}
      />
      <InputNumber
        style={{ margin: '0 50px' }}
        max={15}
        min={-12}
        value={value}
        formatter={(value) => value + '%'}
        onChange={(value) => {
          console.log(value);
          setValue(value);
        }}
      />
      <InputNumber
        size="large"
        max={15}
        min={-12}
        value={value}
        onChange={(value) => {
          console.log(value);
          setValue(value);
        }}
      />
    </>
  );
}
