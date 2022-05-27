import React, { useState } from 'react';
import { TimePicker } from 'tdesign-react';

const { TimePickerPanel } = TimePicker;

function Panel() {
  const [value, setValue] = useState('');

  return (
    <>
      <div>
        <TimePickerPanel value={value} onChange={setValue} />
      </div>
    </>
  );
}

export default Panel;
