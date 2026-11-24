import { render, fireEvent, describe, test, expect, vi, act, beforeEach, afterEach } from '@test/utils';
import React from 'react';
import Loading, { LoadingProps } from '../index';
import { LoadingPlugin } from '../plugin';

describe('Loading', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('props', () => {
    // loading为true显示加载组件
    test(':loading true', async () => {
      const { container } = render(<Loading loading={true}></Loading>);
      expect(container.querySelector('.t-loading')).toBeTruthy();
    });
    // loading为false不显示加载组件
    test(':loading false', async () => {
      const { container } = render(<Loading loading={false}></Loading>);
      expect(container.querySelector('.t-loading')).toBeNull();
    });
    test(':className', async () => {
      const { container } = render(<Loading loading={true} className="t-custom-loading"></Loading>);
      expect(container.querySelector('.t-custom-loading')).toBeTruthy();
    });

    test(':style', async () => {
      const { container } = render(<Loading loading={true} style={{ color: 'red' }}></Loading>);
      expect(container.querySelector('.t-loading').getAttribute('style')).toContain('color: red;');
    });

    test(':inheritColor', async () => {
      const { container } = render(<Loading loading={true} inheritColor></Loading>);
      expect(container.querySelector('.t-loading').getAttribute('style')).toContain('color: inherit;');
    });

    test(':indicator', async () => {
      const { container } = render(<Loading loading={true} indicator={<div>indicator</div>}></Loading>);
      expect(container.querySelector('.t-loading').querySelector('div')).toBeTruthy();
      expect(container.querySelector('.t-loading').querySelector('.t-loading__gradient-conic')).toBeNull();
    });

    test(':text', async () => {
      const { container } = render(<Loading loading={true} text="加载中"></Loading>);
      expect(container.querySelector('.t-loading').querySelector('.t-loading__text').innerHTML).toBe('加载中');
    });

    test(':size', async () => {
      const { container } = render(<Loading loading={true} size="36px"></Loading>);
      expect(container.querySelector('.t-loading').getAttribute('style')).toBe('font-size: 36px;');
    });

    test(':layout', async () => {
      const { container } = render(<Loading loading={true} layout="vertical"></Loading>);
      expect(container.querySelector('.t-loading--vertical')).toBeTruthy();
    });

    test(':reverse', async () => {
      const { container } = render(<Loading loading={true} theme="circular" reverse={true} />);
      const gradientElement = container.querySelector('.t-loading__gradient');

      // 检查动画方向是否反转
      expect(gradientElement.getAttribute('style')).toContain('animation-direction: reverse');
    });

    test(':pause', async () => {
      const { container } = render(<Loading loading={true} theme="circular" pause={true} />);
      const gradientElement = container.querySelector('.t-loading__gradient');

      // 检查动画是否暂停
      expect(gradientElement.getAttribute('style')).toContain('animation: none');
    });

    test(':delay', async () => {
      const { container, rerender } = render(<Loading loading={true} delay={1000} />);

      // 初始状态下，.t-loading 节点存在但内容为空
      const loadingElement = container.querySelector('.t-loading');
      expect(loadingElement).toBeTruthy(); // 节点存在
      expect(loadingElement.innerHTML).toBe(''); // 内容为空

      await act(async () => {
        // 快进时间到 delay 结束
        vi.advanceTimersByTime(1000);

        // 重新渲染以触发状态更新
        rerender(<Loading loading={true} delay={1000} />);
      });

      // 此时 loading 内容应显示
      expect(loadingElement.innerHTML).not.toBe(''); // 内容不为空
    });

    test(':attach', async () => {
      const { container } = render(
        <div>
          <Loading loading={true} attach={() => document.querySelector('#loading-attach')} />
          <div id="loading-attach"></div>
        </div>,
      );

      // 检查 loading 是否挂载到指定的 attach 节点
      const attachNode = container.querySelector('#loading-attach');
      expect(attachNode.querySelector('.t-loading')).toBeTruthy();
    });

    test(':content', async () => {
      const { container } = render(
        <Loading loading={true} content={<div className="custom-content">Custom Content</div>} />,
      );

      // 检查是否渲染了指定的 content
      expect(container.querySelector('.custom-content')).toBeTruthy();
      expect(container.querySelector('.custom-content').textContent).toBe('Custom Content');
    });

    test(':fullscreen and preventScrollThrough', async () => {
      const { container } = render(<Loading loading={true} fullscreen preventScrollThrough></Loading>);
      expect(container.querySelector('.t-loading--fullscreen')).toBeTruthy();
      const classNames = document.body.className;
      expect(classNames).toBe('t-loading--lock');
    });

    test(':theme', async () => {
      const themes = ['circular', 'spinner', 'dots'];
      const checkThemes = (theme: LoadingProps['theme']) => {
        const { container } = render(<Loading loading={true} theme={theme} />);
        const loadingElement = container.querySelector('.t-loading');

        // 根据 theme 类型检查对应的元素是否存在
        switch (theme) {
          case 'circular':
            expect(loadingElement.querySelector('.t-loading__gradient-conic')).toBeTruthy();
            break;
          case 'spinner':
            expect(loadingElement.querySelector('.t-loading__spinner')).toBeTruthy();
            break;
          case 'dots':
            expect(loadingElement.querySelector('.t-loading__dots')).toBeTruthy();
            break;
        }
      };
      themes.forEach(checkThemes);
    });
  });

  describe('plugin', () => {
    test(':loading plugin works', async () => {
      const { container } = render(
        <div>
          <div className="trigger" onClick={() => LoadingPlugin({ attach: '#loading-attach-string' })}>
            container to trigger loading
          </div>
          <div id="loading-attach-string"></div>
        </div>,
      );
      fireEvent.click(container.querySelector('.trigger'));

      expect(container.querySelector('.t-loading')).toBeTruthy();
    });

    test(':hide()', async () => {
      let loadInstance = null;
      const handleAttach = () => {
        loadInstance = LoadingPlugin({ attach: () => document.querySelector('#loading-attach') });
        setTimeout(() => loadInstance.hide(), 1000);
      };
      const { container } = render(
        <div>
          <div className="trigger" onClick={handleAttach}>
            container to trigger loading
          </div>
          <div id="loading-attach"></div>
        </div>,
      );
      fireEvent.click(container.querySelector('.trigger'));

      expect(container.querySelector('#loading-attach .t-loading')).toBeTruthy();

      // 1000ms 后，调用 loadInstance.hide()，loading 组件应该被移除
      await act(async () => {
        vi.advanceTimersByTime(1000);
      });

      expect(container.querySelector('#loading-attach .t-loading')).toBeNull();
    });

    test(':options is false', async () => {
      const instance = LoadingPlugin(false);

      // options 为 false 时，hide() 返回 null
      const hideResult = instance.hide();
      expect(hideResult).toBeNull();
    });
  });
});
