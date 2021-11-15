import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const InputNumberSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 80]);
  const inputNumberProps = { theme: 'row' };

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
