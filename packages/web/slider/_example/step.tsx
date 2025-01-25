import React, { useState } from 'react';
import { Slider } from 'tdesign-react';
import type { SliderValue } from 'tdesign-react';

const StepSlider = () => {
  const [value, setValue] = useState<SliderValue>(10);
  const [rangeValue, setRangeValue] = useState<SliderValue>([10, 80]);

  return (
    <>
      <Slider style={{ marginBottom: 50 }} step={4} value={value} onChange={setValue}></Slider>
      <Slider value={rangeValue} step={4} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default StepSlider;
