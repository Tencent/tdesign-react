import React from 'react';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <Space direction="vertical">
      <DatePicker mode="week" clearable allowInput onChange={handleChange} />
      <DateRangePicker mode="week" clearable allowInput onChange={handleChange} />
    </Space>
  );
}
