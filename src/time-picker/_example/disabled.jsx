import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function HmTimePicker() {
  function disableTime(h, m, s) {
    return h > 10;
  }
  return <TimePicker defaultValue="12:08" format="HH:mm" hideDisabledTime={false} disableTime={disableTime} />;
}
