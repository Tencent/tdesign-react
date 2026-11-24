import React from 'react';
import { ColorObject, ColorPicker } from 'tdesign-mobile-react';

export default function () {
  const onChange = (value: string) => {
    console.log('change', value);
  };
  const onPaletteBarChange = (value: { color: ColorObject }) => {
    console.log('onPaletteBarChange', value);
  };
  return <ColorPicker enableAlpha type="multiple" onChange={onChange} onPaletteBarChange={onPaletteBarChange} />;
}
