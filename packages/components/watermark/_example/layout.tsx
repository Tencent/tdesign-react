import React from 'react';
import { Watermark } from 'tdesign-react';

export default function LayoutWatermark() {
  return (
    <>
      <h3>横平竖直的水印</h3>
      <Watermark
        watermarkContent={{ text: '文字水印' }}
        width={120}
        height={60}
        y={120}
        x={80}
      >
        <div style={{ height: 300 }}></div>
      </Watermark>

      <h3>错位的水印</h3>
      <Watermark
        watermarkContent={{ text: '文字水印' }}
        width={120}
        height={60}
        y={120}
        x={80}
        layout="hexagonal"
      >
        <div style={{ height: 300 }}></div>
      </Watermark>

      <h3>Watermark Test</h3>
      <Watermark
        watermarkContent={[
          { text: '文字水印', fontColor: '#0052D9' },
          { text: '水印水印水印水印', fontColor: '#0052D9' },
        ]}
        width={120}
        height={60}
        y={120}
        x={80}
        layout="hexagonal"
      >
        <div style={{ height: 300 }}></div>
      </Watermark>

      <h3>多行水印</h3>
      <Watermark
        watermarkContent={[
          { text: '水印文本', fontColor: '#0052D9' },
          { text: '水印水印水印水印', fontColor: '#0052D9' },
          { text: '文本文本文本文本文本文本', fontColor: '#0052D9' },
          { url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png' },
        ]}
        lineSpace={24}
        x={100}
        y={120}
        width={158}
        height={22}
        layout="hexagonal"
      >
        <div style={{ height: 300 }}></div>
      </Watermark>

      <h3>多行灰度水印</h3>
      <Watermark
        watermarkContent={[
          { text: '水印文本', fontColor: '#0052D9' },
          { url: 'https://tdesign.gtimg.com/starter/brand-logo-light.png', isGrayscale: true },
        ]}
        lineSpace={24}
        x={100}
        y={120}
        width={158}
        height={22}
        layout="hexagonal"
      >
        <div style={{ height: 300 }}></div>
      </Watermark>
    </>
  );
}
