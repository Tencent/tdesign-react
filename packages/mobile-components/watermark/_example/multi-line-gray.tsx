import React from 'react';
import { Watermark } from 'tdesign-mobile-react';

export default function MultilineWatermark() {
  return (
    <Watermark
      watermarkContent={[
        { text: '水印文本', fontColor: 'black' },
        { url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png', isGrayscale: true },
      ]}
      lineSpace={24}
      x={56}
      y={76}
      width={120}
      height={20}
      alpha={0.3}
    >
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
