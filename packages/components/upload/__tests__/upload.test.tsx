import React from 'react';
import { render, vi, mockDelay } from '@test/utils';
import Upload from '../upload';

const files = [
  {
    url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
    name: 'default.jpeg',
    status: 'success',
  },
];

describe('upload 组件测试', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('imageProps', async () => {
    const { container } = render(
      <Upload
        files={files}
        action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
        theme="image"
        accept="image/*"
        imageProps={{
          className: 'tdesign',
        }}
      />,
    );

    await mockDelay();
    expect(container).toBeInTheDocument();
    expect(container.querySelector('.tdesign')).toBeInTheDocument();
  });
});
