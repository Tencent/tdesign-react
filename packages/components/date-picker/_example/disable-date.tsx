import React from 'react';
import dayjs from 'dayjs';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';

export default function YearDatePicker() {
  const disableTime = (time: Date) => {
    if (dayjs(time).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')) {
      return {
        hour: [0, 1, 2, 3, 4, 5, 6],
      };
    }
    return {};
  };

  return (
    <Space direction="vertical">
      <DatePicker
        placeholder="禁用昨天、前天"
        disableDate={[dayjs().subtract(1, 'day').format(), dayjs().subtract(2, 'day').format()]}
      />
      <DatePicker
        placeholder="明后三天禁用"
        disableDate={{
          from: dayjs().add(1, 'day').format(),
          to: dayjs().add(3, 'day').format(),
        }}
      />
      <DatePicker placeholder="禁用所有周六" disableDate={(date) => dayjs(date).day() === 6} />
      <DatePicker
        placeholder="禁用最近 3 天外的日期"
        disableDate={{
          before: dayjs().subtract(3, 'day').format(),
          after: dayjs().add(3, 'day').format(),
        }}
      />
      <DatePicker
        placeholder="禁用日期精确到时间"
        enableTimePicker
        disableDate={{ before: dayjs().subtract(1, 'day').format() }}
        disableTime={disableTime}
      />
      <DateRangePicker
        placeholder="禁用最近 5 天外的日期"
        disableDate={{
          before: dayjs().subtract(5, 'day').format(),
          after: dayjs().add(5, 'day').format(),
        }}
      />
      <DateRangePicker
        placeholder="禁用开始日期"
        disabled={[true, false]}
        defaultValue={['2026-01-01', '2026-01-10']}
      />
      <DateRangePicker
        placeholder="禁用结束日期"
        disabled={[false, true]}
        enableTimePicker
        defaultValue={['2026-01-01 00:00:00', '2026-01-10 23:59:59']}
      />
    </Space>
  );
}
