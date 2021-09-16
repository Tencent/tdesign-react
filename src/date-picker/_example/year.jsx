import React from 'react';
import { DatePicker } from '@tencent/tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker defaultValue='2025' theme="primary" mode="year" format="YYYY" clearable onChange={handleChange}></DatePicker>
    </div>
  );
}
