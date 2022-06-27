import React from 'react';
import { DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  // 选中日期时的事件
  function onPick(value, context) {
    console.log('onPick:', value, context);
  }
  return (
    <Space direction="vertical">
      <DateRangePicker onPick={onPick} allowInput clearable />
      <DateRangePicker enableTimePicker allowInput clearable onPick={onPick} />
    </Space>
  );
}
