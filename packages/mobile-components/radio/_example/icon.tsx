import React from 'react';
import { Radio } from 'tdesign-mobile-react';

export default function () {
  return (
    <div className="example-radio">
      <Radio className="example-radio__item" allowUncheck label="单选" icon="line" defaultChecked></Radio>
      <Radio className="example-radio__item" allowUncheck label="单选" icon="dot" defaultChecked></Radio>
    </div>
  );
}
