import React, { useState } from 'react';
import { Calendar } from 'tdesign-mobile-react';

export default function () {
  const [visible, setVisible] = useState(false);

  const handleConfirm = (val: Date) => {
    console.log(val);
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
    <Calendar
      usePopup={false}
      visible={visible}
      onConfirm={handleConfirm}
      onSelect={handleSelect}
      onClose={onClose}
    ></Calendar>
  );
}
