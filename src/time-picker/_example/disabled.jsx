import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function HmTimePicker() {
  function disableTime(h) {
    return h < 10;
  }
  return <TimePicker disableTime={disableTime} />;
}
