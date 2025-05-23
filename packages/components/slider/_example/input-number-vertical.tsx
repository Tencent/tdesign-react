import React, { useState } from 'react';
import { Slider } from 'tdesign-react';
import type { SliderProps, SliderValue } from 'tdesign-react';

const InputNumberVerticalSlider = () => {
  const [value, setValue] = useState<SliderValue>(10);
  const [rangeValue, setRangeValue] = useState<SliderValue>([10, 80]);

  const inputNumberProps: SliderProps['inputNumberProps'] = { theme: 'row' };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: 300, marginRight: 100 }}>
        <Slider
          inputNumberProps={inputNumberProps}
          layout="vertical"
          style={{ marginBottom: 50 }}
          value={value}
          onChange={setValue}
        ></Slider>
      </div>
      <div style={{ height: 300 }}>
        <Slider
          inputNumberProps={inputNumberProps}
          layout="vertical"
          value={rangeValue}
          onChange={setRangeValue}
          range
        ></Slider>
      </div>
    </div>
  );
};

export default InputNumberVerticalSlider;
