import React, { useState } from 'react';
import { DatePicker, Space } from 'tdesign-react';
import type { DatePickerProps, DateValue } from 'tdesign-react';

export default function YearDatePicker() {
  const [defaultValue, setDefaultValue] = useState<DateValue>(['2000-01-04', '2000-01-03', '2000-01-05']);

  const handleChange: DatePickerProps['onChange'] = (value, context) => {
    console.log('onChange:', value, context);
    setDefaultValue(value);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Space direction="vertical">
        <DatePicker
          value={defaultValue}
          placeholder="可清除、可输入的日期选择器"
          onChange={handleChange}
          clearable
          multiple
        />
      </Space>
    </div>
  );
}
