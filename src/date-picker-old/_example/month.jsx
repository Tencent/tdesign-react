import React from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker theme="primary" mode="month" format="YYYY-MM"></DatePicker>
    </div>
  );
}
