import React, { useState } from 'react';
import { InputNumber, InputNumberValue, Space } from 'tdesign-react';

export default function InputNumberExample() {
  const [value, setValue] = useState<InputNumberValue>(0);
  const [value1, setValue1] = useState<InputNumberValue>(0);

  return (
    <Space direction="vertical">
      <InputNumber
        max={15}
        min={-12}
        step={1.2}
        format={(value) => `${value} %`}
        value={value}
        onChange={setValue}
        style={{ width: 250 }}
      />
      <InputNumber
        decimalPlaces={2}
        format={(_, { fixedNumber }) => `${fixedNumber} %`}
        value={value1}
        onChange={setValue1}
        style={{ width: 250 }}
      />
    </Space>
  );
}
