import React from 'react';
import { Select, Calendar, Tag } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const [theme, setTheme] = React.useState('full');
  const defaultValue = React.useMemo(() => new Date(), []);

  const getDateStr = React.useCallback((date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const output = `${y}-${m}-${d <= 9 ? `0${d}` : d}`;
    return output;
  }, []);

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
        <label>请选择风格：</label>
        <Select
          style={{
            width: '200px',
            display: 'inline-block',
            margin: '0 10px 0 0',
          }}
          value={theme}
          options={[
            { label: '卡片风格', value: 'card' },
            { label: '全屏风格', value: 'full' },
          ]}
          onChange={(value) => setTheme(value)}
        />
      </div>
      <Calendar
        theme={theme}
        defaultValue={defaultValue}
        cell={(cellData) => {
          const { date } = cellData;
          if (theme === 'card') {
            const isCurrent = getDateStr(date) === getDateStr(defaultValue);
            const disabled = date.getMonth() !== defaultValue.getMonth();

            return (
              <Tag shape="round" theme="success" effect={disabled ? 'plain' : isCurrent ? 'dark' : 'light'}>
                {date.getDate()}
              </Tag>
            );
          }

          if (theme === 'full') {
            return <div>{getDateStr(date)}</div>;
          }

          return null;
        }}
      />
    </div>
  );
}
