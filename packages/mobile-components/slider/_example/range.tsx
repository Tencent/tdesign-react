import React from 'react';
import { Slider } from 'tdesign-mobile-react';

export default function RangDemo() {
  const onChange = (value: number | number[]) => {
    console.log(`change to ${value}`);
  };
  return (
    <div className="wrapper-base">
      <Slider range defaultValue={[30, 70]} onChange={onChange} />
    </div>
  );
}
