import React, { useState } from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function BasicTimePicker() {
  const [value, setValue] = useState(null);

  const handleValueChange = (v) => {
    setValue(v);
  };

  return <TimePicker value={value} onChange={handleValueChange} />;
}
