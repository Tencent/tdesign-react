import React from 'react';
import { DateRangePicker, Space } from '@tdesign/components';

export default function CancelRangeLimitDatePicker() {
  return (
    <Space direction="vertical">
      <DateRangePicker cancelRangeSelectLimit={true} clearable={true} />
    </Space>
  );
}
