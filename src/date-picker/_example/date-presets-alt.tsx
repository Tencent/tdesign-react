import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DateRangePicker, Space, type DateRangeValue, type DateRangePickerProps } from 'tdesign-react';

export default function YearDatePicker() {
  const [presets] = useState<DateRangePickerProps['presets']>({
    最近7天: [dayjs().subtract(6, 'day').toString(), dayjs().toString()],
    最近3天: [dayjs().subtract(2, 'day').toString(), dayjs().toString()],
    今天: [dayjs().toString(), dayjs().toString()],
  });

  const [range1, setRange1] = useState<DateRangeValue>(['2022-01-01', '2022-08-08']);
  const [range2, setRange2] = useState<DateRangeValue>(['2022-01-01 11:11:11', '2022-08-08 12:12:12']);

  return (
    <Space direction="vertical">
      <DateRangePicker value={range1} presets={presets} onChange={(val) => setRange1(val)} />

      <DateRangePicker value={range2} presets={presets} onChange={(val) => setRange2(val)} enableTimePicker />
    </Space>
  );
}
