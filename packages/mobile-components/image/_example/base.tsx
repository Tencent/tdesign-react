import React from 'react';
import { Image } from 'tdesign-mobile-react';

const imageSrc = 'https://tdesign.gtimg.com/mobile/demos/image.png';

export default function BaseImage() {
  return (
    <div className="image-example">
      <div className="image-example-title">不同填充模式的图片</div>
      <div className="image-example-desc">提供 fill、contain、cover、none、scale-down 5 种填充类型。</div>
      <div className="image-group mt-8">
        <div className="image-demo mr-24">
          <p className="image-demo-tip">fill</p>
          <Image className="image-container" style={{ width: '72px', height: '72px' }} fit="fill" src={imageSrc} />
        </div>
        <div className="image-demo mr-24">
          <p className="image-demo-tip">contain</p>
          <Image className="image-container" style={{ width: '89px', height: '72px' }} fit="contain" src={imageSrc} />
        </div>
        <div className="image-demo">
          <p className="image-demo-tip">cover</p>
          <Image className="image-container" style={{ width: '134px', height: '72px' }} fit="cover" src={imageSrc} />
        </div>
        <div className="image-demo mt-24 mr-24">
          <p className="image-demo-tip">none</p>
          <Image className="image-container" style={{ width: '72px', height: '72px' }} fit="none" src={imageSrc} />
        </div>
        <div className="image-demo mt-24">
          <p className="image-demo-tip">scale-down</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '72px' }}
            fit="scale-down"
            src={imageSrc}
          />
        </div>
      </div>
    </div>
  );
}
