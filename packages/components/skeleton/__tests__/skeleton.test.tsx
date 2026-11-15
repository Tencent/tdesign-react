import React from 'react';
import { act, render, vi } from '@test/utils';

import Skeleton from '../index';

import type { SkeletonProps } from '../Skeleton';
import type { TdSkeletonProps } from '../type';

function mountSkeleton(props: SkeletonProps = {}, children?: React.ReactNode) {
  return render(<Skeleton {...props}>{children ?? <p className="skeleton-children">loaded content</p>}</Skeleton>);
}

describe('Skeleton', () => {
  describe('props', () => {
    test('loading', () => {
      const { container, queryByText } = mountSkeleton({ loading: true });
      expect(container.querySelector('.t-skeleton__row')).toBeTruthy();
      expect(queryByText('loaded content')).toBeFalsy();
    });

    test('loading[false]', () => {
      const { container, getByText } = mountSkeleton({ loading: false });
      expect(container.querySelector('.t-skeleton__row')).toBeFalsy();
      expect(getByText('loaded content')).toBeInTheDocument();
    });

    (['text', 'avatar', 'paragraph', 'avatar-text', 'tab', 'article'] as TdSkeletonProps['theme'][]).forEach(
      (theme) => {
        test(`theme[${theme}]`, () => {
          const { container } = mountSkeleton({ theme, loading: true });
          expect(container.querySelectorAll('.t-skeleton__row').length).toBeGreaterThan(0);
          expect(container.querySelector('.t-skeleton__col')).toBeTruthy();
        });
      },
    );

    test('theme[avatar]', () => {
      const { container } = mountSkeleton({ theme: 'avatar', loading: true });
      expect(container.querySelector('.t-skeleton--type-circle')).toBeTruthy();
    });

    (['gradient', 'flashed', 'none'] as TdSkeletonProps['animation'][]).forEach((animation) => {
      test(`animation[${animation}]`, () => {
        const { container } = mountSkeleton({ animation, loading: true });
        const col = container.querySelector('.t-skeleton__col');
        if (animation === 'none') {
          expect(col).not.toHaveClass('t-skeleton--animation-gradient');
          expect(col).not.toHaveClass('t-skeleton--animation-flashed');
        } else {
          expect(col).toHaveClass(`t-skeleton--animation-${animation}`);
        }
      });
    });

    test('rowCol', () => {
      const { container } = mountSkeleton({
        loading: true,
        rowCol: [1, 2, { width: '100px', height: '20px' }],
      });
      const rows = container.querySelectorAll('.t-skeleton__row');
      expect(rows).toHaveLength(3);
      expect(rows[1].querySelectorAll('.t-skeleton__col')).toHaveLength(2);
      const customCol = rows[2].querySelector('.t-skeleton__col') as HTMLElement;
      expect(customCol.style.width).toBe('100px');
      expect(customCol.style.height).toBe('20px');
    });

    test('rowCol nested columns', () => {
      const { container } = mountSkeleton({
        loading: true,
        rowCol: [
          [
            { type: 'circle', size: '40px' },
            { type: 'text', height: '32px' },
          ],
        ],
      });
      const cols = container.querySelectorAll('.t-skeleton__col');
      expect(cols).toHaveLength(2);
      expect(cols[0]).toHaveClass('t-skeleton--type-circle');
      expect((cols[0] as HTMLElement).style.width).toBe('40px');
    });

    test('rowCol with content', () => {
      const { container, getByText } = mountSkeleton({
        loading: true,
        rowCol: [{ type: 'text', content: 'slot content' }],
      });
      expect(getByText('slot content')).toBeInTheDocument();
      expect(container.querySelector('.t-skeleton__col')).toBeTruthy();
    });

    test('className', () => {
      const { container } = mountSkeleton({
        loading: true,
        className: 'custom-skeleton',
      });
      expect(container.firstChild).toHaveClass('custom-skeleton');
    });

    test('style', () => {
      const { container } = mountSkeleton({
        loading: true,
        style: { width: 400 },
      });
      expect(container.firstChild).toHaveStyle({ width: '400px' });
    });

    test('delay', async () => {
      vi.useFakeTimers();
      const { rerender, queryByText, container } = mountSkeleton({
        loading: true,
        delay: 80,
      });
      expect(container.querySelector('.t-skeleton__row')).toBeTruthy();

      rerender(
        <Skeleton loading={false} delay={80}>
          <p className="skeleton-children">loaded content</p>
        </Skeleton>,
      );
      expect(queryByText('loaded content')).toBeFalsy();

      act(() => {
        vi.advanceTimersByTime(80);
      });
      expect(queryByText('loaded content')).toBeInTheDocument();
      vi.useRealTimers();
    });
  });
});
