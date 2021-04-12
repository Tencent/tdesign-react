import React, { useState } from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function TimePickerExample() {
  const [value, setValue] = useState('23:59:59');
  return (
    <div className="tdesign-demo-block">
      <TimePicker value={value} onChange={setValue} format="hh:mm:ss" timeType="time" placeholder="请选择时间" />
    </div>
  );
}
