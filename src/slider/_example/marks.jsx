import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const MarksSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 80]);

  const marks1 = {
    0: '0°C',
    12: '12°C',
    37: '37°C',
    60: <button style={{ color: '#1989FA' }}>60°C</button>,
  };
  const marks2 = {
    0: '0°C',
    8: '8°C',
    37: '37°C',
    50: <strong style={{ color: '#1989FA' }}>50°C</strong>,
    70: '70°C',
  };

  return (
    <>
      <Slider marks={marks1} style={{ marginBottom: 50 }} value={value} onChange={setValue}></Slider>
      <Slider marks={marks2} value={rangeValue} onChange={setRangeValue} range></Slider>
    </>
  );
};

export default MarksSlider;
