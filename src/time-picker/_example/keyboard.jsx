import React, { useState } from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function TimePickerExample() {
  const [value, setValue] = useState('14:23');
  return (
    <div className="tdesign-demo-block">
      <TimePicker value={value} onChange={setValue} format="hh:mm:ss" timeType="time" allowInput />
    </div>
  );
}
