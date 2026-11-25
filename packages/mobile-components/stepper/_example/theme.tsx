import React from 'react';
import { Stepper } from 'tdesign-mobile-react';

export default function theme() {
  return (
    <div className="stepper-example">
      <Stepper defaultValue={3} theme={'filled'}></Stepper>
      <Stepper defaultValue={3} theme={'outline'}></Stepper>
      <Stepper defaultValue={3}></Stepper>
    </div>
  );
}
