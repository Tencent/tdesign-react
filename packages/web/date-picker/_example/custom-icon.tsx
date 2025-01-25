import React from 'react';
import { DatePicker, Space } from 'tdesign-react';
import type { DatePickerProps } from 'tdesign-react';

import { BrowseIcon, LockOnIcon } from 'tdesign-icons-react';

export default function YearDatePicker() {
  const handleChange: DatePickerProps['onChange'] = (value) => {
    console.log(value);
  };

  return (
    <Space>
      <DatePicker prefixIcon={<BrowseIcon />} suffixIcon={<LockOnIcon />} onChange={handleChange} />
    </Space>
  );
}
