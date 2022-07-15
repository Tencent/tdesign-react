import React from 'react';
import { TimePicker, Space } from 'tdesign-react';

export default function HmTimePicker() {
  return (
    <Space direction="vertical">
      <h3>禁止清空</h3>
      <TimePicker defaultValue="12:00:00" />
      <h3>允许清空</h3>
      <TimePicker defaultValue="12:00:00" clearable={true} />
    </Space>
  );
}
