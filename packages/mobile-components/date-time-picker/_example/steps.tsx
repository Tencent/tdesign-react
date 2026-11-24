import React, { useState } from 'react';
import { DateTimePicker, Cell, Popup } from 'tdesign-mobile-react';

export default function DateTimePickerDemo() {
  const [visible, setVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState('');
  const [pickerValueText, setPickerValueText] = useState('');

  const onPick = (value: string) => {
    console.log('[onPick]', value);
  };
  const onChange = (value: string) => {
    console.log('[onChange]', value);
  };

  const onCancel = () => {
    console.log('[onCancel]');
    setVisible(false);
  };

  const onConfirm = (value: string) => {
    console.log('[onConfirm]', value);
    setPickerValueText(value);
    setPickerValue(value);
    setVisible(false);
  };

  return (
    <div>
      <Cell
        bordered={false}
        title="选择时间(间隔)"
        note={pickerValueText || '时 分'}
        onClick={() => setVisible(true)}
      />
      <Popup visible={visible} placement="bottom">
        <DateTimePicker
          defaultValue={pickerValue || '10:10'}
          steps={{ minute: 30 }}
          mode={[null, 'minute']}
          title="选择时间"
          format="HH:mm"
          onPick={onPick}
          onChange={onChange}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      </Popup>
    </div>
  );
}
