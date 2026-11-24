import React, { useState } from 'react';
import { HomeIcon } from 'tdesign-icons-react';
import { Segmented } from 'tdesign-mobile-react';

export default function BaseSegmented() {
  const [valueWithIcon, setValueWithIcon] = useState<string | number>(0);

  const option = [
    { value: 0, label: '选项' },
    { value: 1, label: '选项' },
    { value: 2, label: '选项' },
  ];
  const optionsWithIcon = [
    { value: 0, label: '选项', icon: <HomeIcon /> },
    { value: 1, label: '选项', icon: <HomeIcon /> },
    { value: 2, label: '选项', icon: <HomeIcon /> },
  ];

  return (
    <>
      <div className="example-segmented">
        <Segmented options={option} defaultValue={0} />
      </div>

      <div className="example-segmented">
        <Segmented
          options={optionsWithIcon}
          value={valueWithIcon}
          onChange={({ value, selectedOption }) => {
            console.log('onChangeWithIcon:', value, selectedOption);
            setValueWithIcon(value);
          }}
        />
      </div>
    </>
  );
}
