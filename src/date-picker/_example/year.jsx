import React from 'react';
import { DatePicker, DateRangePicker } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-block-column">
      <DatePicker mode="year" clearable allowInput onChange={handleChange} />
      <DateRangePicker mode="year" clearable allowInput onChange={handleChange} />
    </div>
  );
}
