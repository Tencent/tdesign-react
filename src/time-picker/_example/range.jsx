import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function RangeTimePicker() {
  return <TimePicker defaultValue="12:08" format="HH:mm" />;
}
