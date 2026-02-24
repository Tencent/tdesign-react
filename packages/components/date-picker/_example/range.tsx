import React from 'react';
import { DatePicker, Space } from 'tdesign-react';

export default function DatePickerRangeDemo() {
  return (
    <Space direction="vertical">
      <DatePicker />
      <DatePicker />
    </Space>
  );
}
