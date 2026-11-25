import React from 'react';
import { Stepper } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <div className="stepper-example">
      <Stepper theme="filled" defaultValue={3}></Stepper>
    </div>
  );
}
