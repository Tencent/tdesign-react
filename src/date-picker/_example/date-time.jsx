import React, { useState } from 'react';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  function handleChange(value) {
    console.log(value);
    setValue(value);
  }

  const [value, setValue] = useState('2022-02-02 12:11:11');

  return (
    <div className="tdesign-demo-block-column">
      <DatePicker enableTimePicker value={value} onChange={handleChange} allowInput clearable />

      <DatePicker enableTimePicker value={value} onChange={handleChange} allowInput clearable format="YYYY-MM-DD a hh:mm:ss" />
    </div>
  );
}
