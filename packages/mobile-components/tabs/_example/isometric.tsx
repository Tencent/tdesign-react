import React, { useState } from 'react';
import { Tabs } from 'tdesign-mobile-react';

export default () => {
  const list = [
    {
      value: '1',
      label: '选项',
    },
    {
      value: '2',
      label: '选项',
    },
    {
      value: '3',
      label: '选项',
    },
    {
      value: '4',
      label: '选项',
    },
    {
      value: '5',
      label: '选项',
    },
    {
      value: '6',
      label: '选项',
    },

    {
      value: '7',
      label: '选项',
    },
    {
      value: '8',
      label: '选项',
    },
    {
      value: '9',
      label: '选项',
    },
  ];

  const [currentValue, setCurrentValue] = useState('9');
  const onChange = (value: string) => {
    setCurrentValue(value);
    console.log(value);
  };
  return (
    <div>
      <Tabs value={currentValue} list={list} spaceEvenly={false} onChange={onChange}></Tabs>
    </div>
  );
};
