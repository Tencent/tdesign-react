import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function HmTimePicker() {
  return (
    <>
      <h3>禁止清空</h3>
      <br />
      <TimePicker defaultValue="12:00:00" />
      <br />
      <br />
      <h3>允许清空</h3>
      <br />
      <TimePicker defaultValue="12:00:00" clearable={true} />
    </>
  );
}
