import React from 'react';
import { DatePicker } from '@tencent/tdesign-react';

export default function YearDatePicker() {
  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker theme="primary" mode="date"></DatePicker>
    </div>
  );
}
