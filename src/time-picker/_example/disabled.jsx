import React from 'react';
import { TimePicker, Space } from 'tdesign-react';

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
    <Space direction="vertical">
      <h3>禁用整个选择器</h3>
      <TimePicker disabled={true} />

      <h3>禁用指定时间</h3>
      <TimePicker disableTime={disableTime} />
    </Space>
  );
}
