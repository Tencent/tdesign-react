import React, { useState } from 'react';
import { InputNumber } from 'tdesign-react';

export default function InputNumberExample() {
  const [value, setValue] = useState(1);

  return (
    <InputNumber
      theme="row"
      size="medium"
      max={10}
      min={-1}
      defaultValue={5}
      value={value}
      onChange={(value) => {
        console.log(value);
        setValue(value);
      }}
    ></InputNumber>
  );
}
