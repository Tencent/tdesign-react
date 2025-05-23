import React from 'react';
import { DateRangePicker, Space } from 'tdesign-react';
import type { DateRangePickerProps } from 'tdesign-react';

export default function YearDatePicker() {
  // 选中日期时的事件
  const onPick: DateRangePickerProps['onPick'] = (value, context) => {
    console.log('onPick:', value, context);
  };

  const onChange: DateRangePickerProps['onChange'] = (value, context) => {
    console.log('onChange:', value, context);
    console.log(
      'timestamp',
      context.dayjsValue.map((d) => d.valueOf()),
    );
    console.log(
      'YYYYMMDD',
      context.dayjsValue.map((d) => d.format('YYYYMMDD')),
    );
  };

  return (
    <Space direction="vertical">
      <DateRangePicker onPick={onPick} allowInput clearable onChange={onChange} />
      <DateRangePicker enableTimePicker allowInput clearable onPick={onPick} onChange={onChange} />
    </Space>
  );
}
