import React, { useState } from 'react';
import { Calendar, Cell } from 'tdesign-mobile-react';

export default function () {
  const minDate = new Date(2012, 0, 0);
  const maxDate = new Date(2032, 0, 0);
  const defaultDate = new Date(2022, 1, 18);
  const [value, setValue] = useState(defaultDate);
  const [visible, setVisible] = useState(false);

  const formatDate = (val: Date) => {
    const date = new Date(val);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const handleConfirm = (val: Date) => {
    console.log('confirm: ', val);
    setValue(val);
    setVisible(false);
  };
  const handleSelect = (val: Date) => {
    console.log('select: ', val);
  };
  const onClose = (trigger: string) => {
    setVisible(false);
    console.log('closed by: ', trigger);
  };
  const onPanelChange = ({ year, month }: { year: number; month: number }) => {
    console.log('panel change: ', year, month);
  };
  const onScroll = ({ e }: { e: React.UIEvent }) => {
    console.log('scroll: ', e);
  };

  return (
    <div>
      <Calendar
        visible={visible}
        switchMode="year-month"
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
        onPanelChange={onPanelChange}
        onScroll={onScroll}
      ></Calendar>
      <Cell title="带翻页功能" arrow note={formatDate(value)} onClick={() => setVisible(true)}></Cell>
    </div>
  );
}
