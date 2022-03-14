import React from 'react';
import { InputNumber } from 'tdesign-react';

export default function InputNumberAutoWidthExample() {
  return <InputNumber autoWidth={true} min={-5} defaultValue={1} />;
}
