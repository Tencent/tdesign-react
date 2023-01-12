import React from 'react';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <Space direction="vertical">
      <DatePicker mode="year" clearable allowInput onChange={handleChange} />
      <DateRangePicker mode="year" clearable allowInput onChange={handleChange} />
    </Space>
  );
}
