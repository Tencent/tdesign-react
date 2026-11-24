import React from 'react';
import { Image } from 'tdesign-mobile-react';

const imageSrc = 'https://tdesign.gtimg.com/mobile/demos/image.png';

export default function PositionImage() {
  return (
    <div className="image-example mt-24">
      <div className="image-example-title">不同填充位置的图片</div>
      <div className="image-example-desc">当图片过大时，提供显示图片的局部左侧对齐、或右侧对齐的不同位置。</div>
      <div className="image-group mt-8">
        <div className="image-demo mr-24">
          <p className="image-demo-tip">cover center</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '72px' }}
            fit="cover"
            position="center"
            src={imageSrc}
          />
        </div>
        <div className="image-demo mr-24">
          <p className="image-demo-tip">cover left</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '72px' }}
            fit="cover"
            position="left"
            src={imageSrc}
          />
        </div>
        <div className="image-demo">
          <p className="image-demo-tip">cover right</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '72px' }}
            fit="cover"
            position="right"
            src={imageSrc}
          />
        </div>
        <div className="image-demo mt-24">
          <p className="image-demo-tip">cover top</p>
          <Image style={{ width: '240px', height: '80px' }} fit="cover" position="top" src={imageSrc} />
        </div>
        <div className="image-demo mt-24" style={{ marginRight: '48px' }}>
          <p className="image-demo-tip">cover bottom</p>
          <Image style={{ width: '240px', height: '80px' }} fit="cover" position="bottom" src={imageSrc} />
        </div>
        <div className="image-demo mt-24 mr-24">
          <p className="image-demo-tip">contain top</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '80px' }}
            fit="contain"
            position="top"
            src={imageSrc}
          ></Image>
        </div>
        <div className="image-demo mt-24 mr-24">
          <p className="image-demo-tip">contain bottom</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '80px' }}
            fit="contain"
            position="bottom"
            src={imageSrc}
          ></Image>
        </div>
        <div className="image-demo mt-24">
          <p className="image-demo-tip">contain center</p>
          <Image
            className="image-container"
            style={{ width: '72px', height: '80px' }}
            fit="contain"
            position="center"
            src={imageSrc}
          ></Image>
        </div>
        <div className="image-demo mt-24">
          <p className="image-demo-tip">contain left</p>
          <Image
            className="image-container"
            style={{ width: '180px', height: '80px' }}
            fit="contain"
            position="left"
            src={imageSrc}
          />
        </div>
        <div className="image-demo mt-24">
          <p className="image-demo-tip">contain right</p>
          <Image
            className="image-container"
            style={{ width: '180px', height: '80px' }}
            fit="contain"
            position="right"
            src={imageSrc}
          />
        </div>
      </div>
    </div>
  );
}
