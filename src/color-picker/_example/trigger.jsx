import React from 'react';
import { ColorPicker } from 'tdesign-react';

export default function PanelExample() {
  return (
    <div className="tdesign-demo-block-row">
      <ColorPicker defaultValue={'#0052d9'} />
    </div>
  );
}
