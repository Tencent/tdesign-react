import React from 'react';
import { Watermark } from 'tdesign-react';

export default function ImageWatermark () {
  return (
    <Watermark watermarkContent={{
      url: "https://tdesign.gtimg.com/starter/brand-logo-light.png",
    }} width={158} height={22} x={140} y={120} offset={[70, 80]}>
       <div style={{ height: 300 }}></div>
    </Watermark>
  )
}
