import React from 'react';
import { Watermark } from 'tdesign-mobile-react';

export default function LayoutWatermark() {
  return (
    <>
      <div className="summary" style={{ marginBottom: 16 }}>
        Rectangular Grid 矩形布局
      </div>
      <Watermark watermarkContent={{ text: '文字水印' }} width={68} height={52} y={56} x={56}>
        <div style={{ height: 300 }}></div>
      </Watermark>

      <div className="summary" style={{ marginBottom: 16 }}>
        Hexagonal Grid 六边形网格
      </div>
      <Watermark watermarkContent={{ text: '文字水印' }} width={68} height={52} y={56} x={56} layout="hexagonal">
        <div style={{ height: 300 }}></div>
      </Watermark>
    </>
  );
}
