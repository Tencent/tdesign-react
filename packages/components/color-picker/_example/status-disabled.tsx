import React from 'react';
import { ColorPicker } from 'tdesign-react';

export default function StatusDisabled() {
  const color = '#0052d9';

  return <ColorPicker defaultValue={color} disabled />;
}
