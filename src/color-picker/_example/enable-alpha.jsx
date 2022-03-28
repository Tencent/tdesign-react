import React from 'react';
import { ColorPickerPanel } from 'tdesign-react';

export default function EnableAlpha() {
  const color = '#0052d9';

  const handleChange = (value, context) => {
    console.log(value, context);
  };

  return (
    <div className="tdesign-demo-block-row">
      <ColorPickerPanel defaultValue={color} format="RGBA" enableAlpha onChange={handleChange} />
    </div>
  );
}
