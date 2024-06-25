import React from 'react';
import { Calendar } from 'tdesign-react';

export default function CalendarExample() {
  const value = '1998-11-11'; // new Date(1998, 10, 11)
  return <Calendar value={value} />;
}
