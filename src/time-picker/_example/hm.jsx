import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function BasicTimePicker() {
  return <TimePicker defaultValue="12:08:11" allowInput={true} />;
}
