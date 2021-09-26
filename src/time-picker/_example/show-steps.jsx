import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';

export default function ShowStepsTimePicker() {
  return <TimePicker steps={[1, 2, 3]} allowInput={true} />;
}
