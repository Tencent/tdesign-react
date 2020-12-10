import React from 'react';
import { testExamples, render } from '@test/utils';
import Badge from '../Badge';

// 测试组件代码 Example 快照
testExamples(__dirname);

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
    expect(renderBadge(<Badge count={1} />)).toHaveClass('t-badge-static', 't-badge--circle');
  });

  test('content', async () => {
    // count 0
    expect(renderBadge(<Badge />)).toBeNull();
    expect(renderBadge(<Badge showZero count={0} />)).toBeTruthy();

    // maxCount
    expect(renderBadge(<Badge count={100} />)).toHaveTextContent('99+');
    expect(renderBadge(<Badge count={100} maxCount={100} />)).toHaveTextContent('100');

    // content vs count
    expect(renderBadge(<Badge count={1} content={2} />)).toHaveTextContent('2');
  });

  test('offset', async () => {
    expect(renderBadge(<Badge offset={[1, 2]} count={1} />)).toHaveStyle({ right: '-1px', marginTop: '-2px' });
  });

  test('color', async () => {
    expect(renderBadge(<Badge color="red" count={1} />)).toHaveStyle({ backgroundColor: 'red' });
  });
});
