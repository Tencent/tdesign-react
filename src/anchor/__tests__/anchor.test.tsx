import React from 'react';
import { testExamples, render, fireEvent } from '@test/utils';
import Anchor from '../Anchor';
import { getScroll, scrollTo } from '../_util/dom';

const { AnchorTarget, AnchorItem } = Anchor;

// 测试组件代码 Example 快照
testExamples(__dirname);

jest.resetModules();

describe('Anchor', () => {
  it('util/clipboard', () => {
    jest.mock('../_util/clipboard', () => (args) => args);
    const wrapper = render(
      <AnchorTarget id="/components/anchor/#default" tag="h1">
        基础锚点
      </AnchorTarget>,
    );
    const a = wrapper.container.querySelector('.t-icon-file-copy');
    fireEvent.click(a);

    expect(true).toEqual(true);
  });

  it('util/dom', () => {
    const distance = 0;
    const childTestID = 'childTestID';
    jest.mock('../_util/dom', () => ({
      getScroll: () => 0,
      scrollTo: (args) => args,
    }));

    const wrapper = render(
      <Anchor targetOffset={150}>
        <AnchorItem href="#基础锚点" title="基础锚点" data-testid={childTestID} />
      </Anchor>,
    );

    // target is element
    const domDistance = getScroll(wrapper.getByTestId(childTestID), true);
    expect(domDistance).toEqual(distance);

    // target is null
    const nullDistance = getScroll(null, true);
    expect(nullDistance).toEqual(distance);

    // target is document
    const documentDistance = getScroll(document, true);
    expect(documentDistance).toEqual(distance);

    // target is window
    const windowDistance = getScroll(window, true);
    expect(windowDistance).toEqual(distance);

    const scrollToPromise = scrollTo(10, {});
    expect(scrollToPromise).toBeInstanceOf(Promise);
  });
});
