import React, { useState } from 'react';
import { DateTimePicker, Cell, Popup, type TimeModeValues, type DateTimePickerColumn } from 'tdesign-mobile-react';

const TYPE_UNIT_MAP = {
  year: '年',
  month: '月',
  date: '日',
  hour: '时',
  minute: '分',
  second: '秒',
};

export default function DateTimePickerDemo() {
  const [visible, setVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState('2025-07-09 10:10:10');
  const [pickerValueText, setPickerValueText] = useState('2025-07-09 10:10:10');

  const onPick = (value: string) => {
    console.log('[onPick]', value);
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
    setPickerValue(value);
  };

  const renderLabel = (type: string, value: number) => {
    if (type === 'year') return `${`${value}`.slice(2)} 年`;
    return `${value} ${TYPE_UNIT_MAP[type]}`;
  };

  const filter = (type: TimeModeValues, column: DateTimePickerColumn) => {
    if (type === 'date') {
      return column.filter((item) => +item.value % 2);
    }
    return column;
  };

  return (
    <div>
      <Cell title="选择时间" note={pickerValueText} onClick={() => setVisible(true)} />
      <Popup visible={visible} placement="bottom">
        <DateTimePicker
          value={pickerValue}
          mode={['date', 'second']}
          title="选择时间"
          start="2022-12-12"
          format="YYYY-MM-DD HH:mm:ss"
          renderLabel={renderLabel}
          filter={filter}
          onPick={onPick}
          onChange={onChange}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Popup>
    </div>
  );
}
