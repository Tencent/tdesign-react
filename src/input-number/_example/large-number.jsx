import React from 'react';
import { InputNumber, Space } from 'tdesign-react';

export default function InputNumberExample() {
  return (
    <Space direction="vertical">
      <InputNumber defaultValue={'19999999999999999'} largeNumber autoWidth decimalPlaces={2} step={1} />
      <InputNumber defaultValue={'0.8975527383412673418'} autoWidth largeNumber step={0.888} />
    </Space>
  );
}
