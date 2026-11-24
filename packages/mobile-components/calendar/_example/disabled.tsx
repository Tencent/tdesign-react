import React, { useState } from 'react';
import { Calendar, Cell, TDate } from 'tdesign-mobile-react';

export default function () {
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 20);
  const defaultDate = new Date(2022, 1, 18);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(defaultDate);

  const handleConfirm = (val: Date) => {
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

  const format = (dateObj: TDate) => {
    const { date } = dateObj;
    const dayOfWeek = date.getDay(); // 0 是周日，6 是周六

    // 返回一个新的对象，避免直接修改参数
    return {
      ...dateObj,
      type: dayOfWeek === 0 || dayOfWeek === 6 ? 'disabled' : dateObj.type,
    } as TDate;
  };

  const formatDate = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <>
      <Calendar
        visible={visible}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        format={format}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      />
      <Cell title="含不可选的日历" note={formatDate(value)} arrow onClick={() => setVisible(true)}></Cell>
    </>
  );
}
