import React, { useState } from 'react';
import { DatePicker, Space } from 'tdesign-react';
import type { DatePickerProps, DateMultipleValue } from 'tdesign-react';

export default function YearDatePicker() {
  const [defaultValue, setDefaultValue] = useState<DateMultipleValue>(['2000-01-04', '2000-01-03', '2000-01-10']);

  const handleChange: DatePickerProps['onChange'] = (value: DateMultipleValue, context) => {
    console.log('onChange:', value, context);
    setDefaultValue(value);
  };

  return (
    <Space direction="vertical">
      <DatePicker
        value={defaultValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleChange}
        clearable
        multiple
      />
      <DatePicker
        value={defaultValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleChange}
        clearable
        multiple
        mode="week"
      />
      <DatePicker
        value={defaultValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleChange}
        clearable
        multiple
        mode="year"
      />
    </Space>
  );
}
