import React from 'react';
import { Calendar } from '@tdesign/components';
import type { CalendarWeek } from '@tdesign/components';

export default function CalendarExample() {
  const getWeekText = React.useCallback((calendarWeek: CalendarWeek) => {
    const output = `星期${calendarWeek.day}`;
    return output;
  }, []);

  return <Calendar week={(calendarWeek) => <div>{getWeekText(calendarWeek)}</div>} />;
}
