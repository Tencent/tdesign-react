import React from 'react';
import { DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  // 选中日期时的事件
  function onPick(value, context) {
    console.log('onPick:', value, context);
  }

  function onChange(value, context) {
    console.log('onChange:', value, context);
    console.log('timestamp', context.dayjsValue.map(d => d.valueOf()));
    console.log('YYYYMMDD', context.dayjsValue.map(d => d.format('YYYYMMDD')));
  }

  return (
    <Space direction="vertical">
      <DateRangePicker onPick={onPick} allowInput clearable onChange={onChange} />
      <DateRangePicker enableTimePicker allowInput clearable onPick={onPick} onChange={onChange} />
    </Space>
  );
}
