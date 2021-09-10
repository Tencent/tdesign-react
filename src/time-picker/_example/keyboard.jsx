import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function KeyboardTimePicker() {
  return <TimePicker defaultValue="12:08:00" format="HH:mm:ss" allowInput={true} />;
}
