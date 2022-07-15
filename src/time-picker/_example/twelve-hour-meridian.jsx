import React, { useState } from 'react';
import { TimePicker } from 'tdesign-react';

export default function TwelveHourTimePicker() {
  const [value, setValue] = useState(null);
  const handleValueChange = (v) => {
    setValue(v);
  };
  return <TimePicker format="hh:mm:ss A" value={value} onChange={handleValueChange} />;
}
