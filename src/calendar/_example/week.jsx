import React from 'react';
import { Calendar } from 'tdesign-react';

export default function CalendarExample() {
  const getWeekText = React.useCallback((calendarWeek) => {
    const output = `day-${calendarWeek.day}`;
    return output;
  }, []);

  return <Calendar week={(calendarWeek) => <div>{getWeekText(calendarWeek)}</div>} />;
}
