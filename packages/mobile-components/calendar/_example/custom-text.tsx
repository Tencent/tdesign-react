import React, { useState } from 'react';
import { Calendar, Cell, TDate } from 'tdesign-mobile-react';

export default function () {
  const defaultDate = new Date(2022, 1, 18);
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 15);

  const [value, setValue] = useState(defaultDate);
  const [visible, setVisible] = useState(false);

  const format = (day: TDate) => {
    const { date } = day;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const curDate = date.getDate();
    const dayTmp = day;
    dayTmp.suffix = '¥60';

    if (year === 2022) {
      if (month === 2) {
        const map = {
          1: '初一',
          2: '初二',
          3: '初三',
          14: '情人节',
          15: '元宵节',
        };
        if (curDate in map) {
          dayTmp.prefix = map[curDate];
          dayTmp.suffix = '¥100';
          dayTmp.className = 'is-holiday';
        }
      }
    }

    return day;
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

  const formatDate = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  return (
    <>
      <Cell
        title="带双行描述的日历"
        note={formatDate(value)}
        arrow
        onClick={() => {
          setVisible(true);
        }}
      ></Cell>
      <Calendar
        visible={visible}
        value={value}
        format={format}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      ></Calendar>
    </>
  );
}
