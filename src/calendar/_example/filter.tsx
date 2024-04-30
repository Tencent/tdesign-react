import React from 'react';
import { Switch, Calendar } from 'tdesign-react';

export default function CalendarExample() {
  const [isShowWeekendDefault, setIsShowWeekendDefault] = React.useState(true);

  return (
    <div>
      <div style={{ margin: '12px 0' }}>
        <label>{`${isShowWeekendDefault ? '显示' : '隐藏'}周末`}</label>
        <Switch value={isShowWeekendDefault} onChange={setIsShowWeekendDefault} />
      </div>
      <Calendar isShowWeekendDefault={isShowWeekendDefault} />
    </div>
  );
}
