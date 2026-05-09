import React from 'react';

import dayjs from 'dayjs';
import { DatePicker, DateRangePicker, Space } from 'tdesign-react';

import type { DateValue } from 'tdesign-react';

export default function CellExample() {
  // 自定义日期单元格，例如在特定日期显示标记
  const cell = ({ value }: { value: DateValue }) => {
    const date = dayjs(value).date();
    const isSpecialDate = [5, 15, 25].includes(date);

    return (
      <div style={{ position: 'relative' }}>
        {date}
        {isSpecialDate && (
          <span
            style={{
              position: 'absolute',
              bottom: -4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 4,
              height: 4,
              borderRadius: '50%',
              backgroundColor: 'var(--td-brand-color)',
            }}
          />
        )}
      </div>
    );
  };

  return (
    <Space direction="vertical">
      <DatePicker cell={cell} />
      <DateRangePicker cell={cell} />
    </Space>
  );
}
