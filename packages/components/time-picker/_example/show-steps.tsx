import React from 'react';
import { TimePicker } from 'tdesign-react';

export default function ShowStepsTimePicker() {
  return <TimePicker steps={[1, 5]} format="HH:mm" />;
}
