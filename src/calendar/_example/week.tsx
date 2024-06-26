import React from 'react';
import { Calendar } from 'tdesign-react';
import type { CalendarWeek } from 'tdesign-react';

export default function CalendarExample() {
  const getWeekText = React.useCallback((calendarWeek: CalendarWeek) => {
    const output = `星期${calendarWeek.day}`;
    return output;
  }, []);

  return <Calendar week={(calendarWeek) => <div>{getWeekText(calendarWeek)}</div>} />;
}
