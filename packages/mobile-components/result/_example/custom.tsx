import React from 'react';
import { Image, Result } from 'tdesign-mobile-react';

export default function CustomResult() {
  return (
    <Result
      image={<Image src="https://tdesign.gtimg.com/mobile/demos/result1.png" className="extra-class-image" />}
      title="自定义结果"
      description="描述文字"
    />
  );
}
