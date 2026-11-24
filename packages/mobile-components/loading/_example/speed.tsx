import React, { useState } from 'react';
import { Loading, Slider } from 'tdesign-mobile-react';

export default function SpeedLoading() {
  const [speed, setSpeed] = useState(5);

  const onChange = (value) => {
    setSpeed(value);
  };

  return (
    <div className="loading-demo--speed">
      <div className="loading-demo">
        <Loading duration={(1 / speed) * 3000} text="加载中..." />
      </div>

      <Slider min={0} max={10} value={speed} onChange={onChange} />
    </div>
  );
}
