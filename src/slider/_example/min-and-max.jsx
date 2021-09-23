import React, { useState } from 'react';
import { Slider } from '@tencent/tdesign-react';

const MinAndMaxSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 20]);

  return (
    <>
      <Slider min={10} max={30} style={{ marginBottom: 50 }} value={value} onChange={setValue}></Slider>
      <Slider min={10} max={30} value={rangeValue} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default MinAndMaxSlider;
