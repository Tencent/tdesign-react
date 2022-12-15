import React, { useState } from 'react';
import { TimePicker } from 'tdesign-react';

export default function BasicTimePicker() {
  const [value, setValue] = useState('12:00:00');

  const handleValueChange = (v) => {
    setValue(v);
  };

  const handleOnPick = (v, context) => {
    console.log('onPick', v, context);
  };

  return <TimePicker value={value} onChange={handleValueChange} onPick={handleOnPick} />;
}
