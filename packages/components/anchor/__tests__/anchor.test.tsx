import React from 'react';
import { render, fireEvent, vi } from '@test/utils';
import Anchor from '../Anchor';
import { getScroll } from '../../_util/scroll';
import { TdAnchorProps } from '../type';

const { AnchorItem, AnchorTarget } = Anchor;

describe('Anchor 组件测试', () => {
  const distance = 0;
  const href1 = '#锚点_1';
  const href2 = '#锚点_2';
  const title1 = '锚点_1';
  const title2 = '锚点_2';
  const childTestID1 = 'childTestID_1';
  const childTestID2 = 'childTestID_2';

  const wrapper = (props?: TdAnchorProps & { className?: string; style?: React.CSSProperties }) =>
    render(
      <Anchor targetOffset={150} className={props.className} style={props.style}>
        <AnchorItem href={href1} title={title1} data-testid={childTestID1} />
        <AnchorItem href={href2} title={title2} data-testid={childTestID2} />
      </Anchor>,
    );

  test('Anchor 工具函数', () => {
    // target is element
    const domDistance = getScroll(wrapper().getByTestId(childTestID1), true);
    expect(domDistance).toEqual(distance);

    // target is document
    const documentDistance = getScroll(document, true);
    expect(documentDistance).toEqual(distance);

    // target is window
    const windowDistance = getScroll(window, true);
    expect(windowDistance).toEqual(distance);
  });

  test('render AnchorItem links', async () => {
    wrapper();
    expect(document.querySelector('.t-is-active')).toBe(null);
    expect(document.querySelector(`a[href="${href1}"]`)).not.toBe(null);
    expect(document.querySelector(`a[href="${href2}"]`)).not.toBe(null);
  });

  describe('props', () => {
    test('className', async () => {
      const customClassName = { className: 'custom-class' };
      const { container } = wrapper(customClassName);
      expect(container.querySelector(customClassName.className)).toBe(null);
    });

    test('style', async () => {
      const customStyle = { style: { backgroundColor: 'red' } };
      const { container } = wrapper(customStyle);
      const anchor = container.querySelector('.t-anchor');
      expect(anchor).toHaveStyle(customStyle.style);
    });
  });

  test('render Anchor click', async () => {
    const fn = vi.fn();
    const wrapper = render(
      <div>
        <Anchor targetOffset={150} onClick={fn}>
          <AnchorItem href="#test-a" />
          <AnchorItem href="#test-b" />
          <AnchorItem href="#test-c" title="基础锚点" data-testid={childTestID1} />
        </Anchor>
        <div id="test-c"></div>
      </div>,
    );
    const anchorItem = wrapper.getByTestId(childTestID1);
    fireEvent.click(anchorItem.firstChild);
    expect(fn).toBeCalledTimes(1);
  });

  test('render AnchorTarget', async () => {
    const wrapper = render(
      <div data-testid={childTestID1}>
        <AnchorTarget id="default" tag="h1">
          基础锚点
        </AnchorTarget>
      </div>,
    );
    const { container } = wrapper;
    const anchorItem = wrapper.getByTestId(childTestID1);
    expect(anchorItem).not.toBeNull();
    fireEvent.mouseDown(container.querySelector('#default'));
    const icon = container.querySelector('.t-anchor__copy');
    fireEvent.click(icon);
    expect(icon).not.toBeNull();
  });
});
