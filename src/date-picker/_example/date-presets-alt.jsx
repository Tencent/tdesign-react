import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  const [presets] = useState({
    最近7天: [dayjs().subtract(6, 'day'), dayjs()],
    最近3天: [dayjs().subtract(2, 'day'), dayjs()],
    今天: [dayjs()],
  });
  const [dateText] = useState('日期');
  const [selectedDates, setSelectedDates] = useState(['2020-1-1', '2020-8-8']);

  function handleChange(value) {
    setSelectedDates(value);
  }

  return (
    <div className="tdesign-demo-item--datepicker">
      <DatePicker value={selectedDates} mode="date" presets={presets} range onChange={handleChange}></DatePicker>
      <br />
      <div>
        {dateText}: {selectedDates.join(' 至 ')}
      </div>
    </div>
  );
}
