import React from 'react';
import { Button, Calendar, Select, Switch } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const ref = React.useRef(null);
  const [theme, setTheme] = React.useState('card');
  const [isShowWeekendDefault, setIsShowWeekendDefault] = React.useState(true);

  const toCurrent = React.useCallback(() => {
    ref.current.toCurrent();
  }, [ref]);

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
          change={(value) => setTheme(value)}
        />
        <label>是否显示周末：</label>
        <Switch value={isShowWeekendDefault} onChange={setIsShowWeekendDefault}></Switch>
        <Button theme="primary" style={{ marginLeft: '12px' }} onClick={toCurrent}>
          回到今天
        </Button>
      </div>
      <Calendar ref={ref} theme={theme} isShowWeekendDefault={isShowWeekendDefault} />
    </div>
  );
}
