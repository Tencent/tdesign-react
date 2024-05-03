import React, { useState } from 'react';
import { ColorPickerPanel, type ColorPickerProps } from 'tdesign-react';

export default function EnableAlpha() {
  const [value, setValue] = useState('#0052D9CC');

  const handleChange: ColorPickerProps['onChange'] = (value) => {
    setValue(value);
  };

  return <ColorPickerPanel enableAlpha value={value} format="HEX" onChange={handleChange} />;
}
