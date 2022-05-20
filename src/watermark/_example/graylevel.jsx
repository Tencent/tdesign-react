import React from 'react';
import { Watermark } from 'tdesign-react';

export default function GrayscaleWatermark () {
  return (
    <Watermark watermarkContent={{
      url: "https://tdesign.gtimg.com/starter/brand-logo-light.png",
      isGrayscale: true,
    }} x={140} y={120} offset={[70, 100]} width={158} height={22} alpha={0.3} >
       <div style={{ height: 300 }}></div>
    </Watermark>
  )
}
