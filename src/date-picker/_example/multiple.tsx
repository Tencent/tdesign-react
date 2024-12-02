import React, { useState } from 'react';
import { DatePicker } from 'tdesign-react';
import type { DatePickerProps, DateMultipleValue } from 'tdesign-react';

export default function YearDatePicker() {
  const [defaultValue, setDefaultValue] = useState<DateMultipleValue>(['2000-01-04', '2000-01-03', '2000-01-05']);

  const handleChange: DatePickerProps['onChange'] = (value: DateMultipleValue, context) => {
    console.log('onChange:', value, context);
    setDefaultValue(value);
  };

  return (
    <div>
      <DatePicker
        value={defaultValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleChange}
        clearable
        multiple
      />
    </div>
  );
}
