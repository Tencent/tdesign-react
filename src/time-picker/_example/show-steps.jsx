import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function ShowStepsTimePicker() {
  return <TimePicker defaultValue="12:08:11" steps={[1, 2, 3]} allowInput={true} />;
}
