import React from 'react';
import { Select, Calendar, Space } from 'tdesign-react';

export default function CalendarExample() {
  const [firstDayOfWeek, setFirstDayOfWeek] = React.useState(3);

  return (
    <div>
      <Space align="center" style={{ margin: '12px 0' }}>
        <label>日历的第一列为：</label>
        <Select
          style={{
            width: '200px',
            display: 'inline-block',
            margin: '0 10px 0 0',
          }}
          value={firstDayOfWeek}
          options={[
            { label: '周一', value: 1 },
            { label: '周二', value: 2 },
            { label: '周三', value: 3 },
            { label: '周四', value: 4 },
            { label: '周五', value: 5 },
            { label: '周六', value: 6 },
            { label: '周日', value: 7 },
          ]}
          onChange={(value) => setFirstDayOfWeek(value)}
        />
      </Space>
      <Calendar firstDayOfWeek={firstDayOfWeek} />
    </div>
  );
}
