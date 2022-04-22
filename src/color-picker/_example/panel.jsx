import React from 'react';
import { ColorPickerPanel } from 'tdesign-react';

export default function PanelExample() {
  const handleChange = (value, context) => {
    // console.log('handleChange', value, context);
  };

  const handlePaletteChange = (context) => {
    console.log('色相面板改变', context);
  };

  const handleRecentColorsChange = (value) => {
    console.log('最近使用颜色改变', value);
  };
  return (
    <ColorPickerPanel
      onChange={handleChange}
      onPaletteBarChange={handlePaletteChange}
      onRecentColorsChange={handleRecentColorsChange}
      defaultValue="#0052d9"
      format="HEX"
    />
  );
}
