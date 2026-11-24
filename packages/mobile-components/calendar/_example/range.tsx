import React, { useState } from 'react';
import { Calendar, TCalendarValue } from 'tdesign-mobile-react';
import { SwapRightIcon } from 'tdesign-icons-react';

export default function () {
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 15);
  const today = new Date(2022, 1, 19);
  const tomorrow = new Date(2022, 1, 21);

  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState<TCalendarValue[]>([today, tomorrow]);
  const handleConfirm = (val: TCalendarValue[]) => {
    setValue(JSON.parse(JSON.stringify(val)));

    setVisible(false);
  };
  const handleSelect = (val: Date) => {
    console.log(val);
  };
  const onClose = (trigger: string) => {
    setVisible(false);
    console.log('closed by', trigger);
  };

  const getDateByTimestamp = (val) => {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const formatTimestamp = (val) => {
    if (!val) return '';
    if (Array.isArray(val)) {
      return val.map((date) => getDateByTimestamp(date)).join('、');
    }
    return getDateByTimestamp(val);
  };

  return (
    <div className="example-calendar">
      <Calendar
        visible={visible}
        type="range"
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      />

      <div className="wrapper" onClick={() => setVisible(true)}>
        <div className="wrapper__left">{formatTimestamp(value[0])}</div>
        <SwapRightIcon className="wrapper__center" size={'20px'} />
        <div className="wrapper__right">{formatTimestamp(value[1])}</div>
      </div>
    </div>
  );
}
