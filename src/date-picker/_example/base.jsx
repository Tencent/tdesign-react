import React from 'react';
import { DatePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value, context) {
    console.log('onChange:', value, context);
    console.log('timestamp', context.dayjsValue.valueOf());
    console.log('YYYYMMDD', context.dayjsValue.format('YYYYMMDD'));
  }

  return (
    <Space direction="vertical">
      <DatePicker onChange={handleChange} />
      <DatePicker placeholder="可清除、可输入的日期选择器" onChange={handleChange} clearable allowInput />
    </Space>
  );
}
