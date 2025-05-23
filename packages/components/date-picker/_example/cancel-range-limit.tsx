import React from 'react';
import { DateRangePicker, Space } from 'tdesign-react';

export default function CancelRangeLimitDatePicker() {
  return (
    <Space direction="vertical">
      <DateRangePicker cancelRangeSelectLimit={true} clearable={true} />
    </Space>
  );
}
