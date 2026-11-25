import React, { useState } from 'react';
import { Slider } from 'tdesign-mobile-react';

export default function StepDemo() {
  const [value, setValue] = useState<number>(6.5);
  const marksRange = {
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
  };
  const marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
  };

  const onChange = (value: number) => {
    setValue(value);
  };

  const onDragend = (value: number | number[], context: { e: React.TouchEvent<HTMLDivElement> }) => {
    console.log('[onDragend] ', value, context.e);
  };

  const onDragstart = (context: { e: React.TouchEvent<HTMLDivElement> }) => {
    console.log('[onDragstart] ', context.e);
  };

  return (
    <>
      <div className="wrapper-step">
        <Slider
          value={value}
          marks={marksRange}
          min={5}
          max={10}
          step={0.5}
          onChange={onChange}
          onDragend={onDragend}
          onDragstart={onDragstart}
        />
      </div>
      <div className="wrapper-step">
        <Slider range defaultValue={[20, 60]} marks={marks} step={20} />
      </div>
    </>
  );
}
