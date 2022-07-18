import React from 'react';
import { Watermark } from 'tdesign-react';

export default function ImageWatermark() {
  return (
    <Watermark
      watermarkContent={{
        url: 'https://tdesign.gtimg.com/site/logo-watermark.svg',
      }}
      width={104}
      height={65.5}
      x={90}
      y={100}
      rotate={0}
    >
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
