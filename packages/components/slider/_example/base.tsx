import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const BaseSlider = () => {
  const [value, setValue] = useState<number>(10);
  const [rangeValue, setRangeValue] = useState<number[]>([10, 80]);

  return (
    <>
      <Slider<number>
        label={({ value }) => `${value}%`}
        style={{ marginBottom: 50 }}
        value={value}
        onChange={setValue}
      ></Slider>
      <Slider<number[]> value={rangeValue} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default BaseSlider;
