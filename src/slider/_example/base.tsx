import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const BaseSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 80]);

  return (
    <>
      <Slider
        label={({ value }) => `${value}%`}
        style={{ marginBottom: 50 }}
        value={value}
        onChange={setValue}
      ></Slider>
      <Slider value={rangeValue} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default BaseSlider;
