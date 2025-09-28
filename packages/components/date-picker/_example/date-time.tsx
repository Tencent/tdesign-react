import React, { useState } from 'react';
import { DatePicker, Space } from 'tdesign-react';
import type { DatePickerProps, DateValue } from 'tdesign-react';

export default function YearDatePicker() {
  const [value, setValue] = useState<DateValue>('2022-02-02 12:11:11');
  const [value2, setValue2] = useState<DateValue>('2022-02-02 凌晨 12:11:11');

  const handleChange: DatePickerProps['onChange'] = (value: DateValue) => {
    console.log(value);
    setValue(value);
  };

  return (
    <Space direction="vertical">
      <DatePicker
        enableTimePicker
        value={value}
        onChange={handleChange}
        allowInput
        clearable
        popupProps={{
          overlayStyle: { fontWeight: 'normal' },
          overlayInnerStyle: { fontWeight: 'normal' },
          overlayClassName: 'date-picker-custom-overlay-class',
          overlayInnerClassName: 'date-picker-custom-overlay-inner-class',
        }}
      />

      <DatePicker
        enableTimePicker
        value={value2}
        onChange={(v: DateValue) => setValue2(v)}
        allowInput
        clearable
        format="YYYY-MM-DD a hh:mm:ss"
      />
    </Space>
  );
}
