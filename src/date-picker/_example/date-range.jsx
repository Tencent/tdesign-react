import React from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  return (
    <div className="tdesign-demo-item--datepicker tdesign-demo-block-column">
      <DatePicker mode="date" range></DatePicker>
      <DatePicker mode="date" enableTimePicker range></DatePicker>
    </div>
  );
}
