import React, { useState } from 'react';
import { InputNumber } from 'tdesign-react';

export default function InputNumberExample() {
  const [value, setValue] = useState(3.2);

  return <InputNumber max={15} min={-5} step={1.2} decimalPlaces={2} value={value} onChange={setValue} />;
}
