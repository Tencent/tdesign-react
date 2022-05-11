import React from 'react';
import { Watermark } from 'tdesign-react';

export default function MultilineWatermark () {
  return (
    <Watermark watermarkContent={[
        { text: '水印', fontColor: 'black' },
        { url: "https://tdesign.gtimg.com/starter/brand-logo-light.png" }
      ]} lineSpace={20} x={140} y={120} offset={[70, 80]} width={158} height={22}>
       <div style={{ height: 300 }}></div>
    </Watermark>
  )
}
