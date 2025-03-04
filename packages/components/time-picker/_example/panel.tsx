import React, { useState } from 'react';
import { TimePicker } from '@tdesign/components';

const { TimePickerPanel } = TimePicker;

function Panel() {
  const [value, setValue] = useState('');

  return <TimePickerPanel value={value} onChange={setValue} />;
}

export default Panel;
