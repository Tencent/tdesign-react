import React from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  // 选中日期时的事件
  function onPick(value, context) {
    console.log('onPick:', value, context);
  }
  return (
    <div className="tdesign-demo-item--datepicker tdesign-demo-block-column">
      <DatePicker mode="date" range onPick={onPick}></DatePicker>
      <DatePicker mode="date" enableTimePicker range></DatePicker>
    </div>
  );
}
