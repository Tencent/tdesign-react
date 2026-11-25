import React, { useState } from 'react';
import { Segmented } from 'tdesign-mobile-react';

export default function DisabledSegmented() {
  const [value, setValue] = useState<string | number>(0);

  const optionsWithDisabled = [
    { value: 0, label: '选中' },
    { value: 1, label: '默认' },
    { value: 2, label: '禁用', disabled: true },
  ];

  return (
    <>
      <div className="example-segmented">
        <Segmented
          options={optionsWithDisabled}
          value={value}
          onChange={({ value, selectedOption }) => {
            console.log('onChange:', value, selectedOption);
            setValue(value);
          }}
        />
      </div>
    </>
  );
}
