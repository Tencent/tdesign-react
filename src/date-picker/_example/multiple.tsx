import React, { useState } from 'react';
import { DatePicker, Space } from 'tdesign-react';
import type { DatePickerProps, DateMultipleValue } from 'tdesign-react';

export default function YearDatePicker() {
  const [dateValue, setDateValue] = useState<DateMultipleValue>(['2000-01-04', '2000-01-03', '2000-01-10']);
  const [weekValue, setWeekValue] = useState<DateMultipleValue>(['2024-50周', '2024-51周']);
  const [yearValue, setYearValue] = useState<DateMultipleValue>(['2000', '2001', '2002']);

  const handleDateChange: DatePickerProps['onChange'] = (value: DateMultipleValue, context) => {
    console.log('onChange:', value, context);
    setDateValue(value);
  };

  const handleWeekChange: DatePickerProps['onChange'] = (value: DateMultipleValue, context) => {
    console.log('onChange:', value, context);
    setWeekValue(value);
  };

  const handleYearChange: DatePickerProps['onChange'] = (value: DateMultipleValue, context) => {
    console.log('onChange:', value, context);
    setYearValue(value);
  };

  return (
    <Space direction="vertical">
      <DatePicker
        value={dateValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleDateChange}
        clearable
        multiple
      />
      <DatePicker
        value={weekValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleWeekChange}
        clearable
        multiple
        mode="week"
      />
      <DatePicker
        value={yearValue}
        placeholder="可清除、可输入的日期选择器"
        onChange={handleYearChange}
        clearable
        multiple
        mode="year"
      />
    </Space>
  );
}
