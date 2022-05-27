import React from 'react';
import { TimePicker } from 'tdesign-react';

export default function KeyboardTimePicker() {
  const handleBlur = (param) => {
    console.log(param, 'onBlur');
  };

  const handleInput = (param) => {
    console.log(param, 'onInput');
  };
  return (
    <TimePicker
      defaultValue="12:08:00"
      format="HH:mm:ss"
      onBlur={handleBlur}
      onInput={handleInput}
      allowInput
      clearable
    />
  );
}
