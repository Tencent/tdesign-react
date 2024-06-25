import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const marks = {
  10: 'min:10',
  30: 'max:30',
};

const MinAndMaxSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 20]);

  return (
    <>
      <Slider min={10} max={30} marks={marks} style={{ marginBottom: 50 }} value={value} onChange={setValue}></Slider>
      <Slider min={10} max={30} marks={marks} value={rangeValue} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default MinAndMaxSlider;
