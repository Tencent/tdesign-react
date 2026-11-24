import React, { useState } from 'react';
import { HomeIcon } from 'tdesign-icons-react';
import { Segmented } from 'tdesign-mobile-react';

export default function BlockSegmented() {
  const [value, setValue] = useState<string | number>(0);
  const [valueWithIcon, setValueWithIcon] = useState<string | number>(0);

  const options = [
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
        <Segmented
          block
          options={options}
          value={value}
          onChange={({ value, selectedOption }) => {
            console.log('onChange:', value, selectedOption);
            setValue(value);
          }}
        />
      </div>
      <div className="example-segmented">
        <Segmented
          block
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
