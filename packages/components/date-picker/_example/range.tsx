import React from 'react';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';
import dayjs from 'dayjs';

export default function DatePickerRangeDemo() {
  // 仅允许今天到未来 90 天（返回 true 表示可选）
  const rangeFn = (d: Date) => {
    const now = dayjs().startOf('day');
    const target = dayjs(d).startOf('day');
    const diff = target.diff(now, 'day');
    return diff >= 0 && diff <= 90;
  };

  return (
    <Space direction="vertical">
      <DatePicker
        range={['2000-01-01', '2010-12-31']}
        panelActiveDate={{
          year: 2005,
          month: 10,
        }}
        placeholder="2000-2010之间的日期"
      />
      <DateRangePicker
        range={['2000-01-01', '2010-12-31']}
        panelActiveDate={{
          year: 2005,
          month: 10,
        }}
        placeholder="2000-2010之间的日期"
      />

      {/* 2026开始，不限制结束 */}
      <DatePicker
        range={['2026-01-01', null]}
        panelActiveDate={{
          year: 2005,
          month: 10,
        }}
        placeholder="2026开始，不限制结束"
      />
      <DateRangePicker
        range={['2026-01-01', null]}
        panelActiveDate={{
          year: 2005,
          month: 10,
        }}
        placeholder="2026开始，不限制结束"
      />

      {/* 2026开始，不限制结束 */}
      <DatePicker range={['2026-01-01', null]} placeholder="2026开始，不限制结束" />
      <DateRangePicker range={['2026-01-01', null]} placeholder="2026开始，不限制结束" />

      {/* 未来 90 天 */}
      <DatePicker range={rangeFn} placeholder="未来 90 天" />
      <DateRangePicker range={rangeFn} placeholder="未来 90 天" />
    </Space>
  );
}
