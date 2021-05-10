import React from 'react';
import { Calendar } from '@tencent/tdesign-react';

export default function CalendarExample() {
  return <Calendar defaultValue={new Date(1998, 10, 11)} />;
}
