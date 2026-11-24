import React from 'react';
import { Watermark } from 'tdesign-mobile-react';

export default function BaseWatermark() {
  return (
    <Watermark watermarkContent={{ text: '文字水印' }} y={56} x={56} width={68} height={52}>
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
