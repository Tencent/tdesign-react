import React from 'react';
import { TimePicker } from 'tdesign-react';

const { TimeRangePicker } = TimePicker;

export default function RangeTimePicker() {
  return <TimeRangePicker clearable format="HH:mm:ss" defaultValue={['12:00:00', '12:00:01']} />;
}
