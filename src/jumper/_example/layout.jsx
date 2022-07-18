import React from 'react';
import { Jumper } from 'tdesign-react';

export default function DemoJumper() {
  function handleChange(ctx) {
    console.log('ctx', ctx)
  }

  return <Jumper layout="vertical" onChange={handleChange} />;
}
