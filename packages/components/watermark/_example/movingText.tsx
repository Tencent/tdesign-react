import React from 'react';
import { Watermark } from '@tdesign/components';

export default function MovingTextWatermark() {
  return (
    <Watermark watermarkContent={{ text: '©️版权所有' }} movable>
      <div style={{ height: 300 }}></div>
    </Watermark>
  );
}
