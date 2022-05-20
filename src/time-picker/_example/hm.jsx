import React from 'react';
import { TimePicker } from 'tdesign-react';

export default function HmTimePicker() {
  return <TimePicker defaultValue={'12:00'} format="HH:mm" />;
}
