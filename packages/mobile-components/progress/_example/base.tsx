import React from 'react';
import { Progress } from 'tdesign-mobile-react';

export default function Base() {
  return (
    <div className="example-progress">
      <div className="example-progress__item">
        <Progress percentage={80} />
      </div>

      <div className="summary">百分比内显</div>
      <div className="example-progress__item">
        <Progress theme="plump" percentage={80} />
      </div>

      <div className="summary">环形进度条</div>
      <div className="example-progress__item">
        <Progress theme="circle" percentage={30} />
      </div>

      <div className="summary">微型环形进度条</div>
      <div className="example-progress__item">
        <Progress theme="circle" size={'micro'} percentage={30} label={false} />
      </div>
    </div>
  );
}
