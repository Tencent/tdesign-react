import React from 'react';
import { Select, Calendar } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const [mode, setMode] = React.useState('year');

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
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
          change={(value) => setMode(value)}
        />
      </div>
      <Calendar mode={mode} />
    </div>
  );
}
