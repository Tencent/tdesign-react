import React, { useState } from 'react';
import { CheckIcon } from 'tdesign-icons-react';
import { ColorObject, ColorPicker } from 'tdesign-mobile-react';

type ColorPickerFormat = 'CSS' | 'HEX' | 'RGB' | 'HSL' | 'HSV' | 'CMYK';
const OPTIONS: ColorPickerFormat[] = ['CSS', 'HEX', 'RGB', 'HSL', 'HSV', 'CMYK'];
export default function () {
  const [curFormat, setCurFormat] = useState<ColorPickerFormat>(OPTIONS[0]);
  const [color, setColor] = useState('#7bd60b');
  const handleClickFormat = (format: ColorPickerFormat) => {
    setCurFormat(format);
  };
  const handleColorPickerClick = (value: string) => {
    console.log('change', value);
    setColor(value);
  };
  const handlePaletteBarChange = (e: { color: ColorObject }) => {
    console.log('onPaletteBarChange', e.color);
  };
  return (
    <div>
      <div className="format-line">
        {OPTIONS.map((option) => (
          <div
            key={option}
            className={`format-item ${curFormat === option ? 'active' : ''}`}
            onClick={() => handleClickFormat(option)}
          >
            {curFormat === option ? <CheckIcon className="check-icon" size={14} /> : null}
            {option}
          </div>
        ))}
      </div>
      <ColorPicker
        enableAlpha
        type="multiple"
        format={curFormat}
        value={color}
        onChange={handleColorPickerClick}
        onPaletteBarChange={handlePaletteBarChange}
      />
    </div>
  );
}
