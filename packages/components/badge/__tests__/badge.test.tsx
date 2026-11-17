import React from 'react';
import { render, vi } from '@test/utils';

import Badge from '../Badge';

import type { BadgeProps } from '../Badge';

function renderBadge(badge) {
  const { container } = render(badge);
  return container.firstChild;
}

describe('Badge', () => {
  describe('props', () => {
    test('offset[array<string>]', async () => {
      const badge = renderBadge(
        <Badge offset={[1, 2]} count={1}>
          test
        </Badge>,
      );
      expect(badge.lastChild).toHaveStyle({
        right: '1px',
        'margin-top': '2px',
      });
    });

    test('color', async () => {
      expect(renderBadge(<Badge color="red" count={1} />)).toHaveStyle({
        'background-color': 'red',
      });
    });

    test('children with count', async () => {
      const badge = renderBadge(<Badge count={1}>test</Badge>);
      expect(badge.firstChild.textContent).toBe('test');
      expect(badge.lastChild.textContent).toBe('1');
      expect(badge.lastChild).toHaveClass('t-badge--circle');
      expect(badge.childNodes.length).toBe(2);
    });

    test('shape[round]', async () => {
      expect(
        renderBadge(
          <Badge shape="round" count={1}>
            test
          </Badge>,
        ).lastChild,
      ).toHaveClass('t-badge--round');
    });

    test('dot', async () => {
      expect(
        renderBadge(
          <Badge dot count={1}>
            test
          </Badge>,
        ).lastChild,
      ).toHaveClass('t-badge--dot');
    });

    test('size[small]', async () => {
      expect(
        renderBadge(
          <Badge size="small" count={1}>
            test
          </Badge>,
        ).lastChild,
      ).toHaveClass('t-badge--circle', 't-size-s');
    });

    test('count without wrapper', async () => {
      expect(renderBadge(<Badge count={1} />)).toHaveClass('t-badge--static', 't-badge--circle');
    });

    test('showZero', async () => {
      expect(renderBadge(<Badge />)).toBeNull();
      expect(renderBadge(<Badge showZero count={0} />)).toBeTruthy();
    });

    test('maxCount[number]', async () => {
      expect(renderBadge(<Badge count={100} />)).toHaveTextContent('99+');
      expect(renderBadge(<Badge count={100} maxCount={100} />)).toHaveTextContent('100');
      expect(renderBadge(<Badge count={2} />)).toHaveTextContent('2');
    });
  });

  describe('instanceFunctions', () => {
    describe('ref', () => {
      test.each<{ name: string; props: BadgeProps }>([
        { name: 'count', props: { count: 1 } },
        { name: 'dot', props: { dot: true, count: 1 } },
        { name: 'showZero', props: { count: 0, showZero: true } },
      ])('points to the standalone badge span with $name', ({ props }) => {
        const ref = React.createRef<HTMLSpanElement>();
        const { container } = render(<Badge {...props} ref={ref} />);

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
        expect(ref.current.tagName).toBe('SPAN');
      });

      test.each<{ name: string; props: BadgeProps }>([
        { name: 'children', props: { children: <button>target</button> } },
        { name: 'content', props: { content: <button>target</button> } },
      ])('points to the outer wrapper with $name', ({ props }) => {
        const ref = React.createRef<HTMLSpanElement>();
        const { container } = render(<Badge {...props} count={1} ref={ref} />);
        const child = container.querySelector('button');

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
        expect(ref.current).toHaveClass('t-badge');
        expect(child).not.toBeNull();
        expect(ref.current.firstChild).toBe(child);
        expect(ref.current).not.toBe(container.firstChild.lastChild);
      });

      test('callback attaches to the standalone badge and clears on unmount', () => {
        const ref = vi.fn();
        const { container, unmount } = render(<Badge count={1} ref={ref} />);

        expect(container.firstChild).not.toBeNull();
        expect(ref).toHaveBeenLastCalledWith(container.firstChild);

        unmount();

        expect(ref).toHaveBeenLastCalledWith(null);
      });

      test('clears when the badge is hidden and reattaches when visible', () => {
        const ref = React.createRef<HTMLSpanElement>();
        const { container, rerender } = render(<Badge count={1} ref={ref} />);

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);

        rerender(<Badge count={0} ref={ref} />);

        expect(container.firstChild).toBeNull();
        expect(ref.current).toBeNull();

        rerender(<Badge count={2} ref={ref} />);

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
      });

      test('follows transitions between wrapped and standalone layouts', () => {
        const ref = React.createRef<HTMLSpanElement>();
        const { container, rerender } = render(
          <Badge count={1} ref={ref}>
            target
          </Badge>,
        );

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
        expect(ref.current).toHaveClass('t-badge');

        rerender(<Badge count={1} ref={ref} />);

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
        expect(ref.current).toHaveClass('t-badge--static');

        rerender(
          <Badge count={1} ref={ref}>
            target
          </Badge>,
        );

        expect(ref.current).not.toBeNull();
        expect(ref.current).toBe(container.firstChild);
        expect(ref.current).toHaveClass('t-badge');
      });
    });
  });
});
