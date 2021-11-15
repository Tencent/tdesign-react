import React, { useState } from 'react';
import { Slider } from 'tdesign-react';

const VerticalSlider = () => {
  const [value, setValue] = useState(10);
  const [rangeValue, setRangeValue] = useState([10, 80]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: 300, marginRight: 100 }}>
        <Slider layout="vertical" style={{ marginBottom: 50 }} value={value} onChange={setValue}></Slider>
      </div>
      <div style={{ height: 300 }}>
        <Slider layout="vertical" value={rangeValue} onChange={setRangeValue} range></Slider>
      </div>
    </div>
  );
};

export default VerticalSlider;
