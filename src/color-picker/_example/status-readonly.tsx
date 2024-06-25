import React from 'react';
import { ColorPickerPanel } from 'tdesign-react';

export default function StatusReadonly() {
  const color = '#0052d9';

  return <ColorPickerPanel defaultValue={color} disabled />;
}
