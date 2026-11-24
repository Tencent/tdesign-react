import React from 'react';
import { Image } from 'tdesign-mobile-react';

const imageSrc = 'https://tdesign.gtimg.com/mobile/demos/image.png';

export default function RoundDemo() {
  return (
    <div className="image-example mt-24">
      <div className="image-group">
        <div className="image-demo mr-24">
          <p className="image-demo-tip">方形</p>
          <Image className="image-container" src={imageSrc} fit="cover" />
        </div>
        <div className="image-demo mr-24">
          <p className="image-demo-tip">圆角方形</p>
          <Image className="image-container" src={imageSrc} shape="round" fit="cover" />
        </div>
        <div className="image-demo">
          <p className="image-demo-tip">圆形</p>
          <Image className="image-container" alt="一张图片" src={imageSrc} fit="cover" shape="circle" />
        </div>
      </div>
    </div>
  );
}
