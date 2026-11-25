import React from 'react';
import { Radio } from 'tdesign-mobile-react';

export default function () {
  return (
    <div className="example-radio">
      <Radio className="example-radio__item" allowUncheck label="单选" defaultChecked></Radio>
      <Radio className="example-radio__item" allowUncheck label="单选" placement="right" defaultChecked></Radio>
    </div>
  );
}
