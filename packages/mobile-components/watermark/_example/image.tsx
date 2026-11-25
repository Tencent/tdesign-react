import React from 'react';
import { Watermark } from 'tdesign-mobile-react';

export default function ImageWatermark() {
  return (
    <Watermark
      watermarkContent={{
        url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png',
      }}
      width={120}
      height={20}
      x={56}
      y={76}
    >
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
