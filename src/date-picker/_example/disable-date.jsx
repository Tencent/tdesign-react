import React, { useState } from 'react';
import dayjs from 'dayjs';
import { DatePicker, DateRangePicker } from 'tdesign-react';

export default function YearDatePicker() {
  // 禁用昨天、前天
  const [disableDate] = useState([dayjs().subtract(1, 'day').format(), dayjs().subtract(2, 'day').format()]);
  // 禁用最近 3 天外的日期
  const [disableDate2] = useState({
    before: dayjs().subtract(3, 'day').format(),
    after: dayjs().add(3, 'day').format(),
  });
  // 明后三天禁用
  const [disableDate3] = useState({
    from: dayjs().add(1, 'day').format(),
    to: dayjs().add(3, 'day').format(),
  });
  // 只可选择最近 5 天内的日期
  const [disableDate4] = useState({
    before: dayjs().subtract(5, 'day').format(),
    after: dayjs().add(5, 'day').format(),
  });

  // 禁用所有周六
  function getDisableDate(date) {
    return dayjs(date).day() === 6;
  }

  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-block-column">
      <DatePicker placeholder="禁用昨天、前天" disableDate={disableDate} onChange={handleChange} />
      <DatePicker placeholder="明后三天禁用" disableDate={disableDate3} onChange={handleChange} />
      <DatePicker placeholder="禁用所有周六" disableDate={getDisableDate} onChange={handleChange} />
      <DatePicker placeholder="禁用最近 3 天外的日期" disableDate={disableDate2} onChange={handleChange} />
      <DateRangePicker placeholder="禁用最近 5 天外的日期" disableDate={disableDate4} onChange={handleChange} />
    </div>
  );
}
