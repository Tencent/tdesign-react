import React from 'react';
import { Progress } from 'tdesign-mobile-react';

export default function Circle() {
  return (
    <div className="example-progress">
      <div className="example-progress__item">
        <Progress theme="circle" percentage={30} />
      </div>
      <div className="example-progress__item">
        <Progress theme="circle" percentage={30} status="warning" />
      </div>
      <div className="example-progress__item">
        <Progress theme="circle" percentage={30} status="error" />
      </div>
      <div className="example-progress__item">
        <Progress theme="circle" percentage={100} status="success" />
      </div>
    </div>
  );
}
