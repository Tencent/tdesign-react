import React from 'react';
import { Progress } from 'tdesign-mobile-react';

export default function Plump() {
  return (
    <div className="example-progress">
      <div className="example-progress__item">
        <Progress theme="plump" percentage={80} />
      </div>
      <div className="example-progress__item">
        <Progress theme="plump" percentage={100} />
      </div>
      <div className="example-progress__item">
        <Progress theme="plump" percentage={80} status="warning" />
      </div>
      <div className="example-progress__item">
        <Progress theme="plump" percentage={80} status="error" />
      </div>
      <div className="example-progress__item">
        <Progress theme="plump" percentage={80} color={['#0052D9', '#2BA471']} status="active" />
      </div>
    </div>
  );
}
