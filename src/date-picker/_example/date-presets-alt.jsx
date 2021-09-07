import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from '@tencent/tdesign-react';

export default function YearDatePicker() {
  const [presets] = useState({
    最近7天: [dayjs().subtract(7, 'day'), dayjs().subtract(1, 'day')],
    最近3天: [dayjs().subtract(3, 'day'), dayjs().subtract(1, 'day')],
    今天: [dayjs()],
  });
  const [dateText] = useState('日期');
  const [selectedDates] = useState(dayjs().toISOString());

  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker theme="primary" mode="date" presets={presets} range></DatePicker>
      <br />
      <div>{ dateText }: { selectedDates }</div>
    </div>
  );
}
