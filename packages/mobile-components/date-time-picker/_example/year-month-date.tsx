import React, { useState } from 'react';
import { DateTimePicker, Cell, Popup } from 'tdesign-mobile-react';

export default function DateTimePickerDemo() {
  const [visible, setVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState('2025-07-09');
  const [pickerValueText, setPickerValueText] = useState('2025-07-09');

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

  return (
    <div>
      <Cell title="选择时间" note={pickerValueText} onClick={() => setVisible(true)} />
      <Popup visible={visible} placement="bottom">
        <DateTimePicker
          value={pickerValue}
          mode="date"
          title="选择时间"
          start="2022-12-12"
          format="YYYY-MM-DD"
          onPick={onPick}
          onChange={onChange}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Popup>
    </div>
  );
}
