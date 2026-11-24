import { render } from '@test/utils';
import { act } from '@testing-library/react';
import { expect, it, describe, vi } from 'vitest';
import React from 'react';
import Skeleton, { SkeletonProps } from '../index';

describe('Skeleton', () => {
  describe('props', () => {
    it(':theme', async () => {
      const themes = ['avatar', 'image', 'text', 'paragraph'] as const;
      const themeRowAndCol = {
        avatar: [1, 1],
        image: [1, 1],
        text: [2, 3],
        paragraph: [4, 4],
      };

      const checkThemes = async (theme: SkeletonProps['theme']) => {
        const { container } = render(<Skeleton theme={theme} />);

        const rows = container.querySelectorAll('.t-skeleton__row');
        const cols = container.querySelectorAll('.t-skeleton__col');
        expect(rows.length).toBe(themeRowAndCol[theme][0]);
        expect(cols.length).toBe(themeRowAndCol[theme][1]);
      };

      themes.forEach(checkThemes);
    });

    it(':rowCol', async () => {
      const customRowCols = {
        first: {
          rowCols: [{ size: '48px', type: 'circle' }],
          row: 1,
          col: 1,
        },

        second: {
          rowCols: [{ size: '48px', type: 'rect' }],
          row: 1,
          col: 1,
        },
        third: {
          rowCols: [{ width: '50%' }, { width: '100%' }],
          row: 2,
          col: 2,
        },
        fourth: {
          rowCols: [
            [
              { width: '48px', height: '48px', borderRadius: '6px' },
              { width: '48px', height: '48px', borderRadius: '6px' },
              { width: '48px', height: '48px', borderRadius: '6px' },
              { width: '48px', height: '48px', borderRadius: '6px' },
              { width: '48px', height: '48px', borderRadius: '6px' },
            ],
            [
              { width: '48px', height: '16px', borderRadius: '3px' },
              { width: '48px', height: '16px', borderRadius: '3px' },
              { width: '48px', height: '16px', borderRadius: '3px' },
              { width: '48px', height: '16px', borderRadius: '3px' },
              { width: '48px', height: '16px', borderRadius: '3px' },
            ],
          ],
          row: 2,
          col: 10,
        },
      };

      const checkRowCols = async (key: string) => {
        const { rowCols, row, col } = customRowCols[key];
        const { container } = render(<Skeleton rowCol={rowCols} />);

        const rows = container.querySelectorAll('.t-skeleton__row');
        const cols = container.querySelectorAll('.t-skeleton__col');
        expect(rows.length).toBe(row);
        expect(cols.length).toBe(col);
      };
      Object.keys(customRowCols).forEach(checkRowCols);
    });

    it(':animation', async () => {
      const animations = [
        {
          title: '渐变加载效果',
          value: 'gradient' as SkeletonProps['animation'],
          loading: true,
        },
        {
          title: '闪烁加载效果',
          value: 'flashed' as SkeletonProps['animation'],
          loading: true,
        },
      ];

      const checkAnimation = async (animation) => {
        const { container } = render(
          <Skeleton theme="paragraph" animation={animation.value} loading={animation.loading} />,
        );
        expect(container.querySelector('.t-skeleton__col')).toHaveClass(`t-skeleton--animation-${animation.value}`);
      };

      animations.forEach(checkAnimation);
    });

    it(':delay', async () => {
      vi.useFakeTimers();

      const { container, rerender, getByTestId } = render(
        <Skeleton loading={false} delay={1000}>
          <div data-testid="skeleton-content">
            <p>设置最短延迟响应时间，低于响应时间的操作不显示加载状态。</p>
          </div>
        </Skeleton>,
      );

      // loading = false，不应显示骨架屏，子内容应显示
      const rows1 = container.querySelectorAll('.t-skeleton__row');
      expect(rows1.length).toBe(0);
      expect(getByTestId('skeleton-content')).toBeTruthy();

      // 快进时间 1000ms（达到 delay 时间）
      vi.advanceTimersByTime(1000);

      // loading = false，即使到达 delay 时间，也不应显示骨架屏
      const rows2 = container.querySelectorAll('.t-skeleton__row');
      expect(rows2.length).toBe(0);
      expect(getByTestId('skeleton-content')).toBeTruthy();

      // 将 loading 设置为 true
      rerender(
        <Skeleton loading={true} delay={1000}>
          <div data-testid="skeleton-content">
            <p>设置最短延迟响应时间，低于响应时间的操作不显示加载状态。</p>
          </div>
        </Skeleton>,
      );

      // 快进 500ms，但是 未达 delay 时间，不应显示骨架屏
      await act(async () => {
        vi.advanceTimersByTime(500);
      });

      const rows3 = container.querySelectorAll('.t-skeleton__row');
      expect(rows3.length).toBe(0);
      expect(getByTestId('skeleton-content')).toBeTruthy();

      // 继续时间 500ms，达到 delay 时间，应显示骨架屏
      await act(async () => {
        vi.advanceTimersByTime(500);
      });
      const rows4 = container.querySelectorAll('.t-skeleton__row');
      expect(rows4.length).toBe(2);
      expect(() => getByTestId('skeleton-content')).toThrow(); // getByTestId 在元素不存在时会直接跑出错误

      vi.useRealTimers();
    });

    it(': other sense', () => {
      // 无主题无rowCol时，使用默认值兜底
      const { container } = render(<Skeleton theme={null} rowCol={null} />);

      const rows = container.querySelectorAll('.t-skeleton__row');
      const cols = container.querySelectorAll('.t-skeleton__col');
      expect(rows.length).toBe(2);
      expect(cols.length).toBe(3);

      expect(container.firstChild).toMatchSnapshot();
    });
  });
});
