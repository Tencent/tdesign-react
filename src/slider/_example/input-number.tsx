import React, { useState } from 'react';
import { Slider } from 'tdesign-react';
import type { SliderProps, SliderValue } from 'tdesign-react';

const InputNumberSlider = () => {
  const [value, setValue] = useState<SliderValue>(10);
  const [rangeValue, setRangeValue] = useState<SliderValue>([10, 80]);
  const inputNumberProps: SliderProps['inputNumberProps'] = { theme: 'row' };

  return (
    <>
      <Slider
        style={{ marginBottom: 50 }}
        inputNumberProps={inputNumberProps}
        value={value}
        onChange={setValue}
      ></Slider>
      <Slider value={rangeValue} inputNumberProps={inputNumberProps} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default InputNumberSlider;
