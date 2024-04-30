import React from 'react';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <Space direction="vertical">
      <DatePicker mode="month" clearable allowInput onChange={handleChange} />
      <DateRangePicker mode="month" clearable allowInput onChange={handleChange} />
    </Space>
  );
}
