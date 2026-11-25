import React from 'react';
import { Slider } from 'tdesign-mobile-react';

export default function CapsuleDemo() {
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
      <div className="wrapper-capsule">
        <Slider defaultValue={30} theme="capsule" />
      </div>
      <div className="wrapper-capsule">
        <Slider range defaultValue={[40, 60]} theme="capsule" />
      </div>
      <div className="wrapper-capsule">
        {/* eslint-disable-next-line no-template-curly-in-string */}
        <Slider range defaultValue={[40, 60]} label="${value}%" theme="capsule" />
      </div>
      <div className="wrapper-capsule">
        <Slider defaultValue={60} marks={marks} step={20} theme="capsule" />
      </div>
      <div className="wrapper-capsule">
        <Slider range defaultValue={[20, 80]} marks={marks} step={20} theme="capsule" />
      </div>
    </>
  );
}
