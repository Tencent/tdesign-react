import React from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  return (
    <Space direction="vertical">
      <InputNumber defaultValue={'19999999999999999'} largeNumber decimalPlaces={2} step={1} style={{ width: '350px' }} />
      <InputNumber defaultValue={'0.8975527383412673418'} largeNumber step={0.888} style={{ width: '350px' }} />
    </Space>
  );
}
