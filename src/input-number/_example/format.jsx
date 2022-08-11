import React, { useState } from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  const [value, setValue] = useState(0);

  return (
    <Space>
      <InputNumber
        max={15}
        min={-12}
        step={1.2}
        autoWidth
        format={(value) => value + '%'}
        value={value}
        onChange={setValue}
      />
      <InputNumber
        autoWidth
        decimalPlaces={2}
        format={(value, { fixedNumber }) => `${fixedNumber} %`}
        onChange={setValue}
      />
    </Space>
  );
}
