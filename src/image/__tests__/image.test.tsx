import React from 'react';
import { testExamples, render } from '@test/utils';
import Image from '../Image';

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Image 组件测试', () => {
  const src = 'https://tdesign.gtimg.com/demo/demo-image-1.png';
  test('Image 测试', () => {
    const { container } = render(<Image src={src} style={{ width: 240, height: 160 }} />);
    expect(container.querySelector('.t-image').src).toBe(src);
  });
});
