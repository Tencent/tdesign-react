import React, { useState } from 'react';
import { DatePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  const [value, setValue] = useState('2022-02-02 12:11:11');
  const [value2, setValue2] = useState('2022-02-02 am 12:11:11');

  function handleChange(value) {
    console.log(value);
    setValue(value);
  }

  return (
    <Space direction="vertical">
      <DatePicker enableTimePicker value={value} onChange={handleChange} allowInput clearable />

      <DatePicker
        enableTimePicker
        value={value2}
        onChange={(v) => setValue2(v)}
        allowInput
        clearable
        format="YYYY-MM-DD a hh:mm:ss"
      />
    </Space>
  );
}
