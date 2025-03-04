import React, { useState } from 'react';
import { TimePicker } from '@tdesign/components';

export default function TwelveHourTimePicker() {
  const [value, setValue] = useState(null);
  const handleValueChange = (v: string) => {
    setValue(v);
  };
  return <TimePicker format="hh:mm:ss A" value={value} onChange={handleValueChange} />;
}
