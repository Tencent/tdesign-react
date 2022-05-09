import React from 'react';
import { TimePicker } from 'tdesign-react';

export default function DisabledTimePicker() {
  const disableTime = (h) => {
    const disableHour = [1, 2, 3];
    if (h > 4) {
      return {
        hour: disableHour,
        minute: [30, 31, 32, 33, 34],
      };
    }
    return {
      hour: disableHour,
    };
  };

  return (
    <>
      <h3>禁用整个选择器</h3>
      <br />
      <TimePicker disabled={true} />
      <br />
      <br />
      <h3>禁用指定时间</h3>
      <br />
      <TimePicker disableTime={disableTime} />
    </>
  );
}
