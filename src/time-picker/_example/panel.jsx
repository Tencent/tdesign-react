import React, { useState } from 'react';
import { TimePicker } from 'tdesign-react';

const { TimePickerPanel, TimeRangePickerPanel } = TimePicker;

function Panel() {
  const [value, setValue] = useState('');
  const [rangeValue, setRangeValue] = useState(['', '']);

  return (
    <>
      <div>
        <TimePickerPanel value={value} onChange={setValue} />
      </div>
      <div>
        <TimeRangePickerPanel value={rangeValue} onChange={setRangeValue} />
      </div>
    </>
  );
}

export default Panel;
