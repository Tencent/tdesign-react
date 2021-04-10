import React from 'react';
import { TimePicker } from '@tencent/tdesign-react';
import noop from '../../../es/_util/noop';

export default function TimePickerExample() {
  return (
    <div className="tdesign-demo-block">
      <TimePicker value={['00:00:00', '23:59:59']} onChange={noop} format="HH:mm:ss" timeType="timeRange" />
    </div>
  );
}
