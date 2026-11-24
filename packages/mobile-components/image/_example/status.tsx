import React from 'react';
import { Image, Loading } from 'tdesign-mobile-react';

export default function RoundDemo() {
  return (
    <div className="image-example" style={{ margin: '8px 16px 32px' }}>
      <div className="image-group">
        <div className="image-demo mr-24">
          <p className="image-demo-tip">加载默认提示</p>
          <Image className="image-container" shape="round" />
        </div>
        <div className="image-demo">
          <p className="image-demo-tip">加载自定义提示</p>
          <Image className="image-container" shape="round" loading={<Loading />} />
        </div>
      </div>
      <div className="image-group mt-24">
        <div className="image-demo mr-24">
          <p className="image-demo-tip">失败默认提示</p>
          <Image className="image-container" src="x" shape="round" />
        </div>
        <div className="image-demo">
          <p className="image-demo-tip">失败自定义提示</p>
          <Image
            className="image-container"
            src="x"
            shape="round"
            error={<span style={{ fontSize: 12 }}>加载失败</span>}
          />
        </div>
      </div>
    </div>
  );
}
