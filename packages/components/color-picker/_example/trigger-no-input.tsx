import React from 'react';
import { ColorPicker } from 'tdesign-react';

export default function TriggerNoInputExample() {
  return <ColorPicker defaultValue="#0052d9" showInput={false} format="HEX" />;
}
