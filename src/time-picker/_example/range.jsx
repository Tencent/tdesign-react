import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

const { RangePicker } = TimePicker;
export default function RangeTimePicker() {
  return <RangePicker defaultValue={['12:08:11', '12:08:12']} allowInput={true} />;
}
