import React from 'react';
import { fireEvent, render, vi } from '@test/utils';

import { BackTop } from '..';

import type { TdBackTopProps } from '../type';

describe('BackTop', () => {
  describe('props', () => {
    (['circle', 'square'] as TdBackTopProps['shape'][]).forEach((item) => {
      test(`shape is equal to ${item}`, () => {
        const { container } = render(<BackTop shape={item}></BackTop>);
        expect(container.firstChild).toHaveClass(`t-back-top--${item}`);
        expect(container).toMatchSnapshot();
      });
    });

    const sizeClassNameList = ['t-size-m', 't-size-s'];
    (['medium', 'small'] as TdBackTopProps['size'][]).forEach((item, index) => {
      test(`size is equal to ${item}`, () => {
        const { container } = render(<BackTop size={item}>BackTop</BackTop>);
        expect(container.firstChild).toHaveClass(sizeClassNameList[index]);
        expect(container).toMatchSnapshot();
      });
    });

    (['light', 'primary', 'dark'] as TdBackTopProps['theme'][]).forEach((item) => {
      test(`theme is equal to ${item}`, () => {
        const { container } = render(<BackTop theme={item}>Text</BackTop>);
        expect(container.firstChild).toHaveClass(`t-back-top--theme-${item}`);
        expect(container).toMatchSnapshot();
      });
    });
  });

  describe('slots', () => {
    test('children', () => {
      const { container } = render(
        <BackTop>
          <span className="custom-node">TNode</span>
        </BackTop>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('content', () => {
      const { container } = render(<BackTop content={<span className="custom-node">TNode</span>}></BackTop>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });

    test('default', () => {
      const { container } = render(<BackTop default={<span className="custom-node">TNode</span>}></BackTop>);
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container).toMatchSnapshot();
    });
  });

  describe('events', () => {
    test('click', () => {
      const fn = vi.fn();
      const { container } = render(<BackTop onClick={fn}></BackTop>);
      fireEvent.click(container.firstChild);
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].e.stopPropagation).toBeTruthy();
      expect(fn.mock.calls[0][0].e.type).toBe('click');
    });
  });
});
