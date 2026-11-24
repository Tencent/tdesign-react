import React, { useState } from 'react';
import { Calendar, Cell, ConfigProvider } from 'tdesign-mobile-react';
import enConfig from 'tdesign-mobile-react/es/locale/en_US';

export default function LocalText() {
  const minDate = new Date(2022, 1, 1);
  const maxDate = new Date(2022, 2, 20);
  const defaultDate = new Date(2022, 1, 18);

  const [value, setValue] = useState(defaultDate);
  const [visible, setVisible] = useState(false);

  const format = (val: Date) => {
    const date = new Date(val);
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
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
    <ConfigProvider globalConfig={enConfig}>
      <Calendar
        visible={visible}
        value={value}
        minDate={minDate}
        maxDate={maxDate}
        onConfirm={handleConfirm}
        onSelect={handleSelect}
        onClose={onClose}
      />
      <Cell title="国际化" note={format(value)} arrow onClick={() => setVisible(true)} />
    </ConfigProvider>
  );
}
