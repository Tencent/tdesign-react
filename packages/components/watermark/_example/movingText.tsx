import React from 'react';
import { Watermark } from 'tdesign-react';

export default function MovingTextWatermark() {
  return (
    <Watermark watermarkContent={{ text: '©️版权所有' }} movable>
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
