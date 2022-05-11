import React from 'react';
import { Watermark } from 'tdesign-react';

export default function BaseWatermark () {
  return (
    <Watermark watermarkContent={{ text: '@水印' }} y={100}>
       <div style={{ height: 300 }}></div>
    </Watermark>
  )
}
