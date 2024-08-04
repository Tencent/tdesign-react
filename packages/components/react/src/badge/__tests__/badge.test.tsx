import React from 'react';
import { render } from '@test/utils';
import Badge from '../Badge';

describe('Badge 组件测试', () => {
  function renderBadge(badge) {
    const { container } = render(badge);
    return container.firstChild;
  }

  test('默认 DOM 结构', async () => {
    const badge = renderBadge(<Badge count={1}>test</Badge>);
    expect(badge.firstChild.textContent).toBe('test');
    expect(badge.lastChild.textContent).toBe('1');
    expect(badge.lastChild).toHaveClass('t-badge--circle');
    expect(badge.childNodes.length).toBe(2);
  });

  test('class', async () => {
    expect(renderBadge(<Badge count={1}>test</Badge>).lastChild).toHaveClass('t-badge--circle');
    expect(
      renderBadge(
        <Badge shape="round" count={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--round');
    expect(
      renderBadge(
        <Badge dot count={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--dot');
    expect(
      renderBadge(
        <Badge size="small" count={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--circle', 't-size-s');

    // not a wrapper
    expect(renderBadge(<Badge count={1} />)).toHaveClass('t-badge--static', 't-badge--circle');
  });

  test('count', async () => {
    // count 0
    expect(renderBadge(<Badge />)).toBeNull();
    expect(renderBadge(<Badge showZero count={0} />)).toBeTruthy();

    // maxCount
    expect(renderBadge(<Badge count={100} />)).toHaveTextContent('99+');
    expect(renderBadge(<Badge count={100} maxCount={100} />)).toHaveTextContent('100');

    // count
    expect(renderBadge(<Badge count={2} />)).toHaveTextContent('2');
  });

  test('offset', async () => {
    const badge = renderBadge(
      <Badge offset={[1, 2]} count={1}>
        test
      </Badge>,
    );
    expect(badge.lastChild).toHaveStyle({ right: '1px', 'margin-top': '2px' });
  });

  test('color', async () => {
    expect(renderBadge(<Badge color="red" count={1} />)).toHaveStyle({ 'background-color': 'red' });
  });
});
