import React from 'react';
import { DatePicker } from '@tencent/tdesign-react';

export default function YearDatePicker() {
  return (
    <div className="tdesign-demo-item--datepicker tdesign-demo-block-column">
      <DatePicker theme="primary" mode="date" range></DatePicker>
      <DatePicker theme="primary" mode="date" enableTimePicker range></DatePicker>
    </div>
  );
}
