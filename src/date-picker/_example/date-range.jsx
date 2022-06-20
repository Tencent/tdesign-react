import React from 'react';
import { DateRangePicker } from 'tdesign-react';

export default function YearDatePicker() {
  // 选中日期时的事件
  function onPick(value, context) {
    console.log('onPick:', value, context);
  }
  return (
    <div className="tdesign-demo-block-column">
      <DateRangePicker onPick={onPick} allowInput clearable />
      <DateRangePicker enableTimePicker allowInput clearable onPick={onPick} />
    </div>
  );
}
