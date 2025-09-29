import React from 'react';
import { ImageViewer } from 'tdesign-react';

const img = [
  {
    mainImage: 'https://tdesign.gtimg.com/demo/tdesign-logo.svg',
    isSvg: true,
  },
  {
    mainImage: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
  },
];

const Svg = () => (
  <div style={{ width: 160, height: 160 }}>
    <ImageViewer images={img} zIndex={10000} />
  </div>
);

export default Svg;
