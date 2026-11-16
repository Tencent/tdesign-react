import React from 'react';
import { render, waitFor } from '@test/utils';

import QRCode from '../QRCode';

describe('QRCode', () => {
  const qrcodeTestId = 'qrcode-test-id';

  describe('props', () => {
    test('type[svg]', async () => {
      const { queryByTestId } = render(
        <div data-testid={qrcodeTestId}>
          <QRCode level="Q" type="svg" value={'https://tdesign.tencent.com/'} />
        </div>,
      );

      const svgElement = await waitFor(() => queryByTestId(qrcodeTestId).getElementsByTagName('svg'));
      expect(svgElement).not.toBeNull();
    });

    test('status', async () => {
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

    test('statusRender', async () => {
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

    test('type[canvas]', async () => {
      const { queryByTestId } = render(
        <div data-testid={qrcodeTestId}>
          <QRCode level="Q" value={'https://tdesign.tencent.com/'} />
        </div>,
      );

      const canvasElement = await waitFor(() => queryByTestId(qrcodeTestId).getElementsByTagName('canvas'));
      expect(canvasElement).not.toBeNull();
    });

    test('size and style', async () => {
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
  });
});
