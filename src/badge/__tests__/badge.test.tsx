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
    const badge = renderBadge(<Badge content={1}>test</Badge>);
    expect(badge.firstChild.textContent).toBe('test');
    expect(badge.lastChild.textContent).toBe('1');
    expect(badge.lastChild).toHaveClass('t-badge--circle');
    expect(badge.childNodes.length).toBe(2);
  });

  test('class', async () => {
    expect(renderBadge(<Badge content={1}>test</Badge>).lastChild).toHaveClass('t-badge--circle');
    expect(
      renderBadge(
        <Badge shape="round" content={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--round');
    expect(
      renderBadge(
        <Badge dot content={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--dot');
    expect(
      renderBadge(
        <Badge size="small" content={1}>
          test
        </Badge>,
      ).lastChild,
    ).toHaveClass('t-badge--circle', 't-size-s');

    // not a wrapper
    expect(renderBadge(<Badge content={1} />)).toHaveClass('t-badge-static', 't-badge--circle');
  });

  test('content', async () => {
    // count 0
    expect(renderBadge(<Badge />)).toBeNull();
    expect(renderBadge(<Badge showZero content={0} />)).toBeTruthy();

    // maxCount
    expect(renderBadge(<Badge content={100} />)).toHaveTextContent('99+');
    expect(renderBadge(<Badge content={100} maxCount={100} />)).toHaveTextContent('100');

    // content vs count
    expect(renderBadge(<Badge content={2} />)).toHaveTextContent('2');
  });

  test('offset', async () => {
    expect(renderBadge(<Badge offset={[1, 2]} content={1} />)).toHaveStyle({ right: '-1px', marginTop: '-2px' });
  });

  test('color', async () => {
    expect(renderBadge(<Badge color="red" content={1} />)).toHaveStyle({ backgroundColor: 'red' });
  });
});
