import { testExamples, render } from '@test/utils';
import React from 'react';
import Loading from '../Loading';

testExamples(__dirname);

describe('Loading 组件测试', () => {
  test('render loading when loading props is true', async () => {
    const { container } = render(<Loading loading={true}></Loading>);
    expect(container.querySelector('.t-loading')).toBeTruthy();
  });
  test('render null when loading is false', async () => {
    const { container } = render(<Loading loading={false}></Loading>);
    expect(container.querySelector('.t-loading')).toBeNull();
  });
});
