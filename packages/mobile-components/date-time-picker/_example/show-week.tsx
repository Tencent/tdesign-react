import React, { useState } from 'react';
import { DateTimePicker, Cell, Popup } from 'tdesign-mobile-react';

const calendarMonth = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekMap = {
  0: 'Sun.',
  1: 'Mon.',
  2: 'Tues.',
  3: 'Wed.',
  4: 'Thurs.',
  5: 'Fri.',
  6: 'Sat.',
};

const renderLabel = (type: string, value: number, innerValue: string) => {
  if (type === 'month') {
    return calendarMonth[value - 1];
  }

  if (type === 'date') {
    const dateSuffixes = {
      1: 'st',
      2: 'nd',
      3: 'rd',
    };
    const curOptionDate = [...innerValue.split('-').slice(0, 2), value + 1].join('.');
    const day = new Date(curOptionDate).getDay();

    return `${value + 1}${dateSuffixes[value + 1] || 'th'} ${weekMap[day]}`;
  }

  return `${value}`;
};

export default function DateTimePickerDemo() {
  const [visible, setVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState('2025-07-09');
  const [pickerValueText, setPickerValueText] = useState('2025-07-09 Wed.');
  const [innerValue, setInnerValue] = useState('2025-07-09');

  const onPick = (value: string) => {
    console.log('[onPick]', value);
    setInnerValue(value.split(' ')[0]);
  };
  const onChange = (value) => {
    console.log('[onChange]', value);
  };

  const onCancel = () => {
    console.log('[onCancel]');
    setVisible(false);
  };

  const onConfirm = (value: string) => {
    setVisible(false);
    setPickerValueText(value);
    setPickerValue(value.split(' ')[0]);
  };

  return (
    <div>
      <Cell title="选择时间" note={pickerValueText} onClick={() => setVisible(true)} />
      <Popup visible={visible} placement="bottom">
        <DateTimePicker
          value={pickerValue}
          mode="date"
          title="选择时间"
          start="2022-12-12"
          format="YYYY-MM-DD ddd"
          showWeek
          renderLabel={(type, value) => renderLabel(type, value, innerValue)}
          onPick={onPick}
          onChange={onChange}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Popup>
    </div>
  );
}
