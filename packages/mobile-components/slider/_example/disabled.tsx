import React from 'react';
import { Slider } from 'tdesign-mobile-react';

export default function DisabledDemo() {
  const marks = {
    0: '0',
    20: '20',
    40: '40',
    60: '60',
    80: '80',
    100: '100',
  };
  return (
    <>
      <div className="wrapper-disabled">
        <Slider disabled value={35} />
      </div>
      {/* <div className="wrapper-disabled">
        <Slider showExtremeValue range disabled label="${value}%" value={[40, 60]} />
      </div> */}
      <div className="wrapper-disabled">
        <Slider disabled range value={[20, 60]} marks={marks} step={20} />
      </div>
    </>
  );
}
