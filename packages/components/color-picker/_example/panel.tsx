import React, { useState } from 'react';
import { ColorPickerPanel } from 'tdesign-react';
import type { ColorPickerProps } from 'tdesign-react';

export default function PanelExample() {
  const [recentColors, setRecentColors] = useState([]);
  const handleChange: ColorPickerProps['onChange'] = (value, context) => {
    console.log('handleChange', value, context);
  };

  const handlePaletteChange: ColorPickerProps['onPaletteBarChange'] = (context) => {
    console.log('色相面板改变', context);
  };

  const handleRecentColorsChange: ColorPickerProps['onRecentColorsChange'] = (value) => {
    console.log('最近使用颜色改变', value);
    setRecentColors(value);
  };
  return (
    <ColorPickerPanel
      onChange={handleChange}
      onPaletteBarChange={handlePaletteChange}
      onRecentColorsChange={handleRecentColorsChange}
      recentColors={recentColors}
      defaultValue="#0052d9"
      format="HEX"
    />
  );
}
