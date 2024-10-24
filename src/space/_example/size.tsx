import React, { useState } from 'react';
import { Space, Slider, Button } from 'tdesign-react';
import type { SliderValue } from 'tdesign-react';

const BaseSpace = () => {
  const [size, setSize] = useState<SliderValue>(8);

  return (
    <>
      <Slider value={size} onChange={setSize}></Slider>
      <br />
      <Space size={size}>
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
        <Button>Button</Button>
      </Space>
    </>
  );
};

export default BaseSpace;
