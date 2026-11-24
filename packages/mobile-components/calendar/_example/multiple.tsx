import React, { useState } from 'react';
import { Calendar, Cell, CalendarProps } from 'tdesign-mobile-react';

export default function () {
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 15);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<CalendarProps['value']>([new Date(2022, 1, 18), new Date(2022, 1, 20)]);

  const handleConfirm = (val: Date) => {
    console.log(val);
    setValue(val);
    setVisible(false);
  };
  const handleSelect = (val: Date) => {
    console.log(val);
  };
  const onClose = (trigger: string) => {
    setVisible(false);
    console.log('closed by', trigger);
  };

  const format = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };
  const formatMultipleDates = (dates: any) => {
    if (!dates || !dates.length) return '未选择';
    if (dates.length === 1) return format(dates[0]);

    const dateStrings = dates.map((date) => format(date));
    const result = dateStrings.join(', ');

    if (result.length > 12) {
      return `${result.substring(0, 16)}...`;
    }

    return result;
  };
  return (
    <div>
      <Calendar
        visible={visible}
        type="multiple"
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      ></Calendar>
      <Cell title="多个选择日期" note={formatMultipleDates(value)} arrow onClick={() => setVisible(true)}></Cell>
    </div>
  );
}
