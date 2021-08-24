import React from 'react';
import { Calendar } from '@tencent/tdesign-react';

export default function CalendarExample() {
  const getDateStr = React.useCallback((cellData) => {
    const y = cellData.date.getFullYear();
    const m = cellData.date.getMonth() + 1;
    const d = cellData.date.getDate();
    const output = `${y}-${m}${cellData.mode === 'month' ? `-${d <= 9 ? `0${d}` : d}` : ''}`;
    return output;
  }, []);

  return <Calendar cellAppend={(cellData) => <div>{getDateStr(cellData)}</div>} />;
}
