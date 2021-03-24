import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function TimePickerExample() {
  return (
    <div className="tdesign-demo-block">
      <TimePicker value="23:59:59" format="hh:mm:ss" timeType="time" />
    </div>
  );
}
