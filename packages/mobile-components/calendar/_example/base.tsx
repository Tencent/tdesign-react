import React, { useState } from 'react';
import { Calendar, Cell } from 'tdesign-mobile-react';

export default function () {
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 15);
  const defaultDate = new Date(2022, 1, 18);

  const [value, setValue] = useState(defaultDate);
  const [visible, setVisible] = useState(false);

  const formatDate = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

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

  return (
    <div>
      <Calendar
        visible={visible}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      ></Calendar>
      <Cell title="单个选择日期" note={formatDate(value)} arrow onClick={() => setVisible(true)}></Cell>
    </div>
  );
}
