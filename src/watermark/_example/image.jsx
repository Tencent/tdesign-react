import React from 'react';
import { Watermark } from 'tdesign-react';

export default function ImageWatermark() {
  return (
    <Watermark watermarkContent={{
      url: "https://tdesign.gtimg.com/site/logo-watermark.svg",
    }} x={80} y={100} rotate={0}>
      <div style={{ height: 300 }}></div>
    </Watermark>
  )
}
