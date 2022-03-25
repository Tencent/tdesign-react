import React from 'react';
import { RangeInput } from 'tdesign-react';

export default function BaseExample() {
  return (
    <div className="tdesign-demo-block-column">
      <RangeInput status="success" />
      <RangeInput status="warning" />
      <RangeInput status="error" />
    </div>
  );
}
