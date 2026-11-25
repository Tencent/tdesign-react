import React from 'react';
import { Watermark } from 'tdesign-mobile-react';

export default function MovingTextWatermark() {
  return (
    <Watermark watermarkContent={{ text: '文字水印' }} movable>
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
