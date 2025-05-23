import { render, fireEvent } from '@test/utils';
import React from 'react';
import Loading from '../Loading';
import { LoadingPlugin as loading } from '../plugin';

describe('Loading 组件测试', () => {
  // loading为true显示加载组件
  test('render loading when loading props is true', async () => {
    const { container } = render(<Loading loading={true}></Loading>);
    expect(container.querySelector('.t-loading')).toBeTruthy();
  });
  // loading为false不显示加载组件
  test('render null when loading is false', async () => {
    const { container } = render(<Loading loading={false}></Loading>);
    expect(container.querySelector('.t-loading')).toBeNull();
  });
  test('loading className works', async () => {
    const { container } = render(<Loading loading={true} className="t-custom-loading"></Loading>);
    expect(container.querySelector('.t-custom-loading')).toBeTruthy();
  });

  test('loading style works', async () => {
    const { container } = render(<Loading loading={true} style={{ color: 'red' }}></Loading>);
    expect(container.querySelector('.t-loading').getAttribute('style')).toBe('color: red;');
  });

  test('loading indicator works', async () => {
    const { container } = render(<Loading loading={true} indicator={<div>indicator</div>}></Loading>);
    expect(container.querySelector('.t-loading').querySelector('div')).toBeTruthy();
    expect(container.querySelector('.t-loading').querySelector('.t-loading__gradient-conic')).toBeNull();
  });

  test('loading text works', async () => {
    const { container } = render(<Loading loading={true} text="加载中"></Loading>);
    expect(container.querySelector('.t-loading').querySelector('.t-loading__text').innerHTML).toBe('加载中');
  });

  test('loading size works', async () => {
    const { container } = render(<Loading loading={true} size="36px"></Loading>);
    // 设置size 非枚举 则渲染font size 的style 且不渲染size的class
    expect(container.querySelector('.t-loading').getAttribute('style')).toBe('font-size: 36px;');
    expect(container.querySelector('.t-size-m')).toBeNull();
  });

  test('loading plugin works', async () => {
    const { container } = render(
      <div>
        <div
          className="trigger"
          onClick={() => loading({ attach: () => document.querySelector('#loading-attach') }) as any}
        >
          container to trigger loading
        </div>
        <div id="loading-attach"></div>
      </div>,
    );
    fireEvent.click(container.querySelector('.trigger'));

    expect(container.querySelector('.t-loading')).toBeTruthy();
  });
});
