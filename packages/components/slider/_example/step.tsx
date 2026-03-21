import React, { useState } from 'react';
import { Slider, Space, Switch } from 'tdesign-react';
import type { SliderValue } from 'tdesign-react';

const StepSlider = () => {
  const [showStep, setShowStep] = useState<boolean>(false);
  const [value, setValue] = useState<SliderValue>(10);
  const [rangeValue, setRangeValue] = useState<SliderValue>([10, 80]);

  return (
    <>
      <Space style={{ marginBottom: 60 }}>
        <Switch value={showStep} onChange={(v) => setShowStep(v)} />
        显示步长刻度
      </Space>

      <Space direction="vertical" size={50} style={{ width: '100%' }}>
        <Slider value={value} step={4} showStep={showStep} onChange={setValue}></Slider>
        <Slider value={rangeValue} step={4} showStep={showStep} onChange={setRangeValue} range></Slider>
      </Space>
    </>
  );
};

export default StepSlider;
