import React, { useState } from 'react';
import { TimePicker, Space } from 'tdesign-react';

const { TimeRangePicker } = TimePicker;

export default function RangeTimePicker() {
  const [time1, setTime1] = useState('20:22');
  const [time2, setTime2] = useState(['00:00:00', '23:59:59']);
  return (
    <Space direction="vertical">
      <TimePicker
        value={time1}
        onChange={setTime1}
        presets={{
          上午十一点: '11:00:00',
        }}
        clearable
      />

      <TimeRangePicker
        value={time2}
        onChange={setTime2}
        style={{ marginTop: '20px' }}
        clearable
        format="HH:mm:ss"
        allow-input
        presets={{
          下午: ['13:00:00', '18:00:00'],
        }}
      />
    </Space>
  );
}
