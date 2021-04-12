import React, { useState } from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function TimePickerExample() {
  const [value, setValue] = useState(() => new Date());
  return (
    <div className="tdesign-demo-block">
      <TimePicker value={value} onChange={setValue} format="hh:mm:ss" timeType="time" allowInput />
    </div>
  );
}
