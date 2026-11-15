import React from 'react';
import { vi } from 'vitest';
import { render, waitFor } from '@test/utils';

import Progress from '../Progress';

import type { ThemeEnum } from '../type';

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

describe('Progress', () => {
  describe('props', () => {
    test.each<[ThemeEnum, string]>([
      ['line', 'thin'],
      ['plump', 'plump'],
      ['circle', 'circle'],
    ])('theme[%s]', async (theme, classSuffix) => {
      const testId = 'progress test theme';
      const { getByTestId } = render(
        <div data-testid={testId}>
          <Progress strokeWidth={120} theme={theme} size={120} />
        </div>,
      );

      const instance = await waitFor(() => getByTestId(testId));
      expect(instance.querySelector(`.t-progress--${classSuffix}`)).not.toBeNull();
    });

    test.each([
      ['small', 72],
      ['medium', 112],
      ['large', 160],
    ] as const)('size[%s]', async (size, expectedWidth) => {
      const { getByTestId } = render(
        <div data-testid="progress-size">
          <Progress strokeWidth="120px" theme="circle" size={size} />
        </div>,
      );
      const instance = await waitFor(() => getByTestId('progress-size'));
      expect(instance.querySelector('.t-progress--circle')).toHaveStyle(`width: ${expectedWidth}px`);
    });

    test('size[number]', async () => {
      const { getByTestId } = render(
        <div data-testid="progress-size-number">
          <Progress strokeWidth="120px" theme="circle" size={240} />
        </div>,
      );
      const instance = await waitFor(() => getByTestId('progress-size-number'));
      expect(instance.querySelector('.t-progress--circle')).toHaveStyle('width: 240px');
    });

    test('label[TNode]', async () => {
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

    test('theme[plump] and label[false]', async () => {
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
  });

  describe('scenarios', () => {
    test('plump theme and percentage place label inside when width is sufficient', async () => {
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

    test('plump theme and percentage place label outside when width is insufficient', async () => {
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
  });
});
