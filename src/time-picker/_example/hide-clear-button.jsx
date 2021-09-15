import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function HmTimePicker() {
  return <TimePicker defaultValue="12:08:00" clearable={false} />;
}
