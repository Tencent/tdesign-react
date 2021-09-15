import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

const { RangePicker } = TimePicker;
export default function RangeTimePicker() {
  return <RangePicker allowInput={true} />;
}
