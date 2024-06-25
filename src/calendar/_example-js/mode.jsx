import React from 'react';
import { Select, Calendar, Space } from 'tdesign-react';

export default function CalendarExample() {
  const [mode, setMode] = React.useState('year');

  return (
    <div>
      <Space align="center" style={{ margin: '12px 0' }}>
        <label>可以在组件外切换成：</label>
        <Select
          style={{
            width: '200px',
            display: 'inline-block',
            margin: '0 10px 0 0',
          }}
          value={mode}
          options={[
            { label: '月历', value: 'year' },
            { label: '日历', value: 'month' },
          ]}
          onChange={(value) => setMode(value)}
        />
      </Space>
      <Calendar mode={mode} />
    </div>
  );
}
