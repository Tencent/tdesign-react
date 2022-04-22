import React from 'react';
import { ColorPickerPanel } from 'tdesign-react';

export default function StatusReadonly() {
  const color = '#0052d9';

  return (
    <div className="tdesign-demo-block-row">
      <ColorPickerPanel defaultValue={color} disabled />
    </div>
  );
}
