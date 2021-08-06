import React from 'react';
import { Calendar } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const getDateStr = React.useCallback((date) => {
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    const output = `${y}-${m}-${d <= 9 ? `0${d}` : d}`;
    return output;
  }, []);

  return <Calendar cellAppend={(date) => <div>{getDateStr(date)}</div>} />;
}
