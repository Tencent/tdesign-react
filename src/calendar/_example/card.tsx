import React from 'react';
import { Button, Calendar, Select, Switch, Space } from 'tdesign-react';

export default function CalendarExample() {
  const ref = React.useRef(null);
  const [theme, setTheme] = React.useState('card');
  const [fillWithZero, setFillWithZero] = React.useState(false);
  const toCurrent = React.useCallback(() => {
    ref.current.toCurrent();
  }, [ref]);

  return (
    <Space direction="vertical" size="large">
      <Space align="center">
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
        <Button theme="primary" style={{ marginLeft: '12px' }} onClick={toCurrent}>
          回到今天
        </Button>
      </Space>
      <Space align="center">
        <label>日期补零：</label>
        <Switch size="large" value={fillWithZero} onChange={(val) => setFillWithZero(val)}></Switch>
      </Space>
      <Calendar ref={ref} theme={theme} isShowWeekendDefault={true} fillWithZero={fillWithZero} />
    </Space>
  );
}
