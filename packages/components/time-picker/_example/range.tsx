import React from 'react';
import { TimePicker } from 'tdesign-react';

const { TimeRangePicker } = TimePicker;

export default function RangeTimePicker() {
  return (
    <TimeRangePicker
      clearable
      format="HH:mm:ss"
      defaultValue={undefined}
      allowInput
      placeholder={['开始时间', '结束时间']}
    />
  );
}
