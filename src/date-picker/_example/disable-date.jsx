import React, { useState } from 'react';
import dayjs from 'dayjs'
import { DatePicker } from 'tdesign-react';

export default function YearDatePicker() {
  // 禁用昨天、前天
  const [disableDate] = useState([dayjs().subtract(1, 'day').format(), dayjs().subtract(2, 'day').format()]);
  // 只可选择最近6天内的日期
  const [disableDate2] = useState({
    before: dayjs().subtract(2, 'day').format(),
    after: dayjs().add(3, 'day').format(),
  });
  // 明后三天禁用
  const [disableDate3] = useState({
    from: dayjs().add(1, 'day').format(),
    to: dayjs().add(3, 'day').format(),
  });
  const [disableDate4] = useState({
    before: dayjs().subtract(2, 'day').format(),
    after: dayjs().add(10, 'day').format(),
  });

  function getDisableDate(date) {
    // 禁用所有周六
    return dayjs(date).day() === 6;
  }

  function handleChange(value) {
    console.log(value);
  }

  return (
    <div className="tdesign-demo-block-column">
      <div className="tdesign-demo-item--datepicker">
        <DatePicker theme="primary" mode="date" disableDate={disableDate} onChange={handleChange} />
      </div>
      <div className="tdesign-demo-item--datepicker">
        <DatePicker theme="primary" mode="date" disableDate={disableDate2} onChange={handleChange} />
      </div>
      <div className="tdesign-demo-item--datepicker">
        <DatePicker theme="primary" mode="date" disableDate={disableDate3} onChange={handleChange} />
      </div>
      <div className="tdesign-demo-item--datepicker">
        <DatePicker theme="primary" mode="date" range disableDate={disableDate4} onChange={handleChange} />
      </div>
      <div className="tdesign-demo-item--datepicker">
        <DatePicker theme="primary" mode="date" disableDate={getDisableDate} onChange={handleChange} />
      </div>
    </div>
  );
}
