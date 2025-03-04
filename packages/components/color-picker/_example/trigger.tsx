import React from 'react';
import { ColorPicker } from '@tdesign/components';

export default function PanelExample() {
  return <ColorPicker defaultValue={'#0052d9'} showPrimaryColorPreview={false} format="HEX" />;
}
