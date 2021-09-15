import React, { useState } from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function TwelveHourTimePicker() {
  const [value, setValue] = useState(null);
  const handleValueChange = (v) => {
    setValue(v);
  };
  return <TimePicker format="a hh:mm:ss" value={value} onChange={handleValueChange} />;
}
