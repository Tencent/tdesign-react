import React from 'react';
import { testExamples, render } from '@test/utils';
import Image from '../Image';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Image 组件测试', () => {
  const src = 'http://0729iwiki-75822.gzc.vod.tencent-cloud.com/u=1595072465,3644073269&fm=193&f=GIF.jpeg';
  test('Image 测试', () => {
    const { container } = render(<Image src={src} style={{ width: 240, height: 160 }} />);
    expect(container.querySelector('.t-image').src).toBe(src);
  });
});
