import React from 'react';
import { Watermark } from 'tdesign-react';

export default function LayoutWatermark() {
  return (
    <>
      <h3>横平竖直的水印</h3>
      <Watermark watermarkContent={{ text: '文字水印' }} width={120} height={60} y={120} x={80}>
        <div style={{ height: 300 }}></div>
      </Watermark>

      <h3>错位的水印</h3>
      <Watermark watermarkContent={{ text: '文字水印' }} width={120} height={60} y={120} x={80} layout="hexagonal">
        <div style={{ height: 300 }}></div>
      </Watermark>
    </>
  );
}
