import React from 'react';
import { Watermark } from 'tdesign-react';

export default function MovingImageWatermark() {
  return (
    <Watermark
      watermarkContent={{
        url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png',
      }}
      movable
      width={158}
      height={22}
    >
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
