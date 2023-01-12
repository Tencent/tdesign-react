import React from 'react';
import { TimePicker, Space } from 'tdesign-react';

export default function HmTimePicker() {
  return (
    <Space direction="vertical">
      <h3>时分选择</h3>
      <TimePicker defaultValue={'12:00'} format="HH:mm" />
      <h3>毫秒选择</h3>
      <TimePicker defaultValue={'12:59:59:000'} format="HH:mm:ss:SSS" />
    </Space>
  );
}
