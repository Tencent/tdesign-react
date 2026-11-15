import React from 'react';
import { fireEvent, render } from '@test/utils';

import { ConfigContext } from '../../config-provider';
import { defaultGlobalConfig } from '../../config-provider/ConfigContext';
import Loading from '../Loading';
import { LoadingPlugin as loading } from '../plugin';

describe('Loading', () => {
  describe('props', () => {
    test('loading[boolean]', () => {
      const { container: loadingContainer } = render(<Loading loading={true}></Loading>);
      expect(loadingContainer.querySelector('.t-loading')).toBeTruthy();

      const { container: idleContainer } = render(<Loading loading={false}></Loading>);
      expect(idleContainer.querySelector('.t-loading')).toBeNull();
    });

    test('className', () => {
      const { container } = render(<Loading loading={true} className="t-custom-loading"></Loading>);
      expect(container.querySelector('.t-custom-loading')).toBeTruthy();
    });

    test('style', () => {
      const { container } = render(<Loading loading={true} style={{ color: 'red' }}></Loading>);
      expect(container.querySelector('.t-loading').getAttribute('style')).toBe('color: red;');
    });

    test('text[string]', () => {
      const { container } = render(<Loading loading={true} text="加载中"></Loading>);
      expect(container.querySelector('.t-loading').querySelector('.t-loading__text').innerHTML).toBe('加载中');
    });

    test('size[string]', () => {
      const { container } = render(<Loading loading={true} size="36px"></Loading>);
      expect(container.querySelector('.t-loading').getAttribute('style')).toBe('font-size: 36px;');
      expect(container.querySelector('.t-size-m')).toBeNull();
    });

    test('indicator[TNode]', () => {
      const { container } = render(<Loading loading={true} indicator={<div>indicator</div>}></Loading>);
      expect(container.querySelector('.t-loading').querySelector('div')).toBeTruthy();
      expect(container.querySelector('.t-loading').querySelector('.t-loading__gradient-conic')).toBeNull();
    });
  });

  describe('scenarios', () => {
    test('ConfigContext loading config supplies component defaults', async () => {
      const { container } = render(
        <ConfigContext.Provider
          value={{
            globalConfig: {
              ...defaultGlobalConfig,
              loading: { text: '全局加载中', size: '36px', zIndex: 1234 },
            },
          }}
        >
          <Loading />
        </ConfigContext.Provider>,
      );

      expect(container.querySelector('.t-loading__text')).toHaveTextContent('全局加载中');
      expect(container.querySelector('.t-loading')).toHaveStyle({
        fontSize: '36px',
        zIndex: '1234',
      });
    });

    test('text and size override ConfigContext loading defaults', async () => {
      const { container } = render(
        <ConfigContext.Provider
          value={{
            globalConfig: {
              ...defaultGlobalConfig,
              loading: { text: '全局加载中', size: '36px' },
            },
          }}
        >
          <Loading text="局部加载中" size="small" />
        </ConfigContext.Provider>,
      );

      expect(container.querySelector('.t-loading__text')).toHaveTextContent('局部加载中');
      expect(container.querySelector('.t-size-s')).toBeTruthy();
    });
  });

  describe('instanceFunctions', () => {
    test('LoadingPlugin attaches an instance to the configured container', async () => {
      const { container } = render(
        <div>
          <div
            className="trigger"
            onClick={() =>
              loading({
                attach: () => document.querySelector('#loading-attach'),
              }) as any
            }
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
});
