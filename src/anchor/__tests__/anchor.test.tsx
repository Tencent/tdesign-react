import React from 'react';
import { render } from '@test/utils';
import Anchor from '../Anchor';
import { getScroll, scrollTo } from '../_util/dom';

const { AnchorItem } = Anchor;

describe('Anchor 组件测试', () => {
  const distance = 0;
  const childTestID = 'childTestID';

  test('Anchor 工具函数', () => {
    const wrapper = render(
      <Anchor targetOffset={150}>
        <AnchorItem href="#基础锚点" title="基础锚点" data-testid={childTestID} />
      </Anchor>,
    );

    // target is element
    const domDistance = getScroll(wrapper.getByTestId(childTestID), true);
    expect(domDistance).toEqual(distance);

    // target is document
    const documentDistance = getScroll(document, true);
    expect(documentDistance).toEqual(distance);

    // target is window
    const windowDistance = getScroll(window, true);
    expect(windowDistance).toEqual(distance);

    const scrollToPromise = scrollTo(10, {});
    expect(scrollToPromise).toBeInstanceOf(Promise);
  });

  test('render links', async () => {
    render(
      <Anchor>
        <AnchorItem href="#test-a" />
        <AnchorItem href="#test-b" />
      </Anchor>,
    );
    expect(document.querySelector('.t-is-active')).toBe(null);
    expect(document.querySelector('a[href="#test-a"]')).not.toBe(null);
    expect(document.querySelector('a[href="#test-b"]')).not.toBe(null);
  });
});
