import React from 'react';
import { Radio } from 'tdesign-mobile-react';

export default function () {
  const options = [
    {
      value: '1',
      checked: true,
      label: '选项禁用-已选',
    },
    {
      value: '2',
      checked: false,
      label: '选项禁用-默认',
    },
  ];
  return (
    <div className="example-radio">
      {options.map((opt) => (
        <Radio
          className="example-radio__item"
          defaultChecked={opt.checked}
          allowUncheck
          label={opt.label}
          disabled
          key={opt.value}
        ></Radio>
      ))}
    </div>
  );
}
