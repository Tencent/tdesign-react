import React from 'react';
import { render, waitFor } from '@test/utils';
import QRCode from '../QRCode';

describe('qrcode 组件测试', () => {
  const qrcodeTestId = 'qrcode-test-id';

  test('canvas 二维码测试', async () => {
    const { queryByTestId } = render(
      <div data-testid={qrcodeTestId}>
        <QRCode level="Q" value={'https://tdesign.tencent.com/'} />
      </div>,
    );

    const canvasElement = await waitFor(() => queryByTestId(qrcodeTestId).getElementsByTagName('canvas'));
    expect(canvasElement).not.toBeNull();
  });

  test('svg 二维码测试', async () => {
    const { queryByTestId } = render(
      <div data-testid={qrcodeTestId}>
        <QRCode level="Q" type="svg" value={'https://tdesign.tencent.com/'} />
      </div>,
    );

    const svgElement = await waitFor(() => queryByTestId(qrcodeTestId).getElementsByTagName('svg'));
    expect(svgElement).not.toBeNull();
  });

  test('二维码尺寸测试', async () => {
    const width = 200;
    const { queryByTestId } = render(
      <div data-testid={qrcodeTestId}>
        <QRCode
          className="qrcode-test"
          style={{ backgroundColor: 'red' }}
          borderless={true}
          size={width}
          value={'https://tdesign.tencent.com/'}
        />
      </div>,
    );

    // 容器元素
    const conElement = await waitFor(() => queryByTestId(qrcodeTestId).getElementsByClassName('qrcode-test')[0]);
    // 获取计算后的样式
    const computedStyle = window.getComputedStyle(conElement);
    expect(computedStyle.width).toBe(`${width}px`);
    expect(computedStyle['background-color']).toBe(`red`);
  });

  test('二维码状态测试', async () => {
    const { queryByTestId } = render(
      <div data-testid={qrcodeTestId}>
        <QRCode status="loading" value={'https://tdesign.tencent.com/'} />
        <QRCode status="expired" onRefresh={() => console.log('refresh')} value={'https://tdesign.tencent.com/'} />
        <QRCode status="scanned" value={'https://tdesign.tencent.com/'} />
      </div>,
    );

    // 容器元素
    const conElement = await waitFor(() => queryByTestId(qrcodeTestId));

    expect(conElement.querySelector('.t-loading')).not.toBeNull();
    expect(conElement.querySelector('.t-expired__text')).not.toBeNull();
    expect(conElement.querySelector('.t-expired__button')).not.toBeNull();
    expect(conElement.querySelector('.t-scanned')).not.toBeNull();
  });

  test('二维码自定义渲染', async () => {
    const customStatusRender = (info) => {
      switch (info.status) {
        case 'expired':
          return <div className="expired">点击刷新</div>;
        case 'loading':
          return <div className="loading">loading</div>;
        case 'scanned':
          return <div className="scanned">已扫描</div>;
        default:
          return null;
      }
    };

    const { queryByTestId } = render(
      <div data-testid={qrcodeTestId}>
        <QRCode status="loading" value={'https://tdesign.tencent.com/'} statusRender={customStatusRender} />
        <QRCode
          status="expired"
          onRefresh={() => console.log('refresh')}
          value={'https://tdesign.tencent.com/'}
          statusRender={customStatusRender}
        />
        <QRCode status="scanned" value={'https://tdesign.tencent.com/'} statusRender={customStatusRender} />
      </div>,
    );

    // 容器元素
    const conElement = await waitFor(() => queryByTestId(qrcodeTestId));

    expect(conElement.querySelector('.loading')).not.toBeNull();
    expect(conElement.querySelector('.expired')).not.toBeNull();
    expect(conElement.querySelector('.scanned')).not.toBeNull();
  });
});
