/* eslint-disable prefer-destructuring */
/*
 * @Author: Bin
 * @Date: 2022-04-07
 * @FilePath: /tdesign-react/src/progress/__tests__/progress.test.tsx
 */
import React from 'react';
import { render, waitFor, act } from '@test/utils';
import { vi } from 'vitest';
import Progress from '../Progress';
import { ThemeEnum } from '../type';

// Mock ResizeObserver
const mockResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
window.ResizeObserver = mockResizeObserver as any;

// Mock offsetWidth
Object.defineProperties(HTMLElement.prototype, {
  offsetWidth: {
    get() {
      // 根据元素 class 返回不同的宽度
      if (this.classList.contains('t-progress__inner')) {
        return 200; // 进度条填充区域宽度
      }
      if (this.classList.contains('t-progress__info')) {
        return 30; // label 文字宽度
      }
      return 0;
    },
    configurable: true,
  },
});

describe('Progress 组件测试', () => {
  test('render theme', async () => {
    const testId = 'progress test theme';
    const themes: ThemeEnum[] = ['line', 'plump', 'circle'];
    const { getByTestId } = render(
      <div data-testid={testId}>
        {themes?.map((theme, index) => (
          <Progress key={index} strokeWidth={120} theme={theme} size={120} />
        ))}
      </div>,
    );

    const instance = await waitFor(() => getByTestId(testId));

    for (let index = 0; index < themes.length; index++) {
      const theme = themes[index];
      expect(() => instance.querySelector(`.t-progress--${theme}`)).not.toBe(null);
    }
  });

  test('render size', async () => {
    // const testId = 'progress test size';
    const sizes: any[] = [
      { name: 'small', size: 72 },
      { name: 'medium', size: 112 },
      { name: 'large', size: 160 },
      { name: 240, size: 240 },
    ];

    const createProgressSizeTest = async (sizeOjb: any) => {
      //   const sizeOjb = sizes[0];
      const testId = `progress test size ${sizeOjb.name}`;
      const view = render(
        <div data-testid={testId}>
          <Progress strokeWidth={'120px'} theme="circle" size={sizeOjb.name} />
        </div>,
      );
      const instance = await waitFor(() => view.getByTestId(testId));
      expect(instance.querySelector('.t-progress--circle')).toHaveStyle(`width: ${sizeOjb.size}px`);
    };

    await createProgressSizeTest(sizes[0]);
    await createProgressSizeTest(sizes[1]);
    await createProgressSizeTest(sizes[2]);
    await createProgressSizeTest(sizes[3]);
  });

  describe('plump theme label position', () => {
    test('label should be inside when inner width is enough', async () => {
      const testId = 'progress plump inside';
      const { getByTestId } = render(
        <div data-testid={testId}>
          <Progress theme="plump" percentage={80} />
        </div>,
      );

      const instance = await waitFor(() => getByTestId(testId));
      // inner(200) >= label(30) + 8，label 应在内部
      expect(instance.querySelector('.t-progress--over-ten')).toBeTruthy();
    });

    test('label should be outside when inner width is not enough', async () => {
      const testId = 'progress plump outside';
      // Mock 小的 inner 宽度
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get() {
          if (this.classList.contains('t-progress__inner')) {
            return 20; // 小于 label 宽度
          }
          if (this.classList.contains('t-progress__info')) {
            return 30;
          }
          return 0;
        },
        configurable: true,
      });

      const { getByTestId } = render(
        <div data-testid={testId}>
          <Progress theme="plump" percentage={5} />
        </div>,
      );

      const instance = await waitFor(() => getByTestId(testId));

      // inner(20) < label(30) + 8，label 应在外部
      expect(instance.querySelector('.t-progress--under-ten')).toBeTruthy();

      // 恢复原始 mock
      Object.defineProperty(HTMLElement.prototype, 'offsetWidth', {
        get() {
          if (this.classList.contains('t-progress__inner')) {
            return 200;
          }
          if (this.classList.contains('t-progress__info')) {
            return 30;
          }
          return 0;
        },
        configurable: true,
      });
    });

    test('label should be hidden when label is false', async () => {
      const testId = 'progress plump no label';
      const { getByTestId } = render(
        <div data-testid={testId}>
          <Progress theme="plump" percentage={50} label={false} />
        </div>,
      );

      const instance = await waitFor(() => getByTestId(testId));
      // label 为 false 时不显示
      expect(instance.querySelector('.t-progress__info')).toBeFalsy();
    });

    test('custom label should render correctly', async () => {
      const testId = 'progress plump custom label';
      const customLabel = <span data-testid="custom-label">Custom</span>;
      const { getByTestId } = render(
        <div data-testid={testId}>
          <Progress theme="plump" percentage={50} label={customLabel} />
        </div>,
      );

      const instance = await waitFor(() => getByTestId(testId));
      expect(instance.querySelector('[data-testid="custom-label"]')).toBeTruthy();
    });
  });
});
