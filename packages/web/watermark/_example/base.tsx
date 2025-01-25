import React from 'react';
import { Watermark } from 'tdesign-react';

export default function BaseWatermark() {
  return (
    <Watermark watermarkContent={{ text: '文字水印' }} y={120} x={80}>
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
