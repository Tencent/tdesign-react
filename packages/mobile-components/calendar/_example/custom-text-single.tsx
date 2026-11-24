import React, { useState } from 'react';
import { Calendar, Cell, TDate } from 'tdesign-mobile-react';

export default function () {
  const defaultDate = new Date(2022, 1, 18);
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 15);

  const [value, setValue] = useState(defaultDate);
  const [visible, setVisible] = useState(false);

  const singleFormat = (day: TDate) => ({
    ...day,
    suffix: '¥60',
  });

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

  const formatDate = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <div className="example-calendar">
      <Cell
        title="带单行描述的日历"
        note={formatDate(value)}
        arrow
        onClick={() => {
          setVisible(true);
        }}
      ></Cell>
      <Calendar
        visible={visible}
        value={value}
        format={singleFormat}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      ></Calendar>
    </div>
  );
}
